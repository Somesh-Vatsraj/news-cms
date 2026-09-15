import { ok, fail } from '../utils/response.js';
import { readJson, requireFields } from '../utils/validation.js';
import { requireAdmin } from '../middleware/auth.js';

const POSITIONS = ['header','homepage_top','homepage_middle','sidebar','article_top','article_middle','article_bottom','footer'];

export async function list(request, env) {
  const auth = await requireAdmin(request, env);
  if (auth.error) return auth.error;
  const rows = await env.DB.prepare(`SELECT * FROM advertisements ORDER BY created_at DESC`).all();
  return ok({ items: rows.results });
}

/** Public: return active ads for a position (ignores code that has expired) */
export async function byPosition(request, env, position) {
  const now = new Date().toISOString().slice(0, 10);
  const rows = await env.DB.prepare(
    `SELECT * FROM advertisements WHERE position = ? AND status = 'active'
     AND (start_date IS NULL OR start_date = '' OR start_date <= ?)
     AND (end_date IS NULL OR end_date = '' OR end_date >= ?)`
  ).bind(position, now, now).all();
  return ok({ items: rows.results });
}

export async function create(request, env) {
  const auth = await requireAdmin(request, env);
  if (auth.error) return auth.error;
  const b = await readJson(request);
  const missing = requireFields(b, ['name', 'position']);
  if (missing.length) return fail('Name and position are required.', 400);
  if (!POSITIONS.includes(b.position)) return fail('Invalid position.', 400);
  const res = await env.DB.prepare(
    `INSERT INTO advertisements (name, position, code, image_url, target_url, status, start_date, end_date)
     VALUES (?,?,?,?,?,?,?,?)`
  ).bind(
    b.name, b.position, b.code || '', b.image_url || '', b.target_url || '',
    b.status === 'inactive' ? 'inactive' : 'active',
    b.start_date || null, b.end_date || null
  ).run();
  return ok({ id: res.meta.last_row_id }, 'Ad created');
}

export async function update(request, env, id) {
  const auth = await requireAdmin(request, env);
  if (auth.error) return auth.error;
  const b = await readJson(request);
  const row = await env.DB.prepare(`SELECT * FROM advertisements WHERE id = ?`).bind(id).first();
  if (!row) return fail('Not found', 404);
  if (b.position && !POSITIONS.includes(b.position)) return fail('Invalid position.', 400);
  await env.DB.prepare(
    `UPDATE advertisements SET name=?, position=?, code=?, image_url=?, target_url=?, status=?, start_date=?, end_date=?, updated_at=datetime('now') WHERE id=?`
  ).bind(
    b.name ?? row.name, b.position ?? row.position, b.code ?? row.code,
    b.image_url ?? row.image_url, b.target_url ?? row.target_url,
    b.status ?? row.status, b.start_date ?? row.start_date, b.end_date ?? row.end_date, id
  ).run();
  return ok({}, 'Ad updated');
}

export async function remove(request, env, id) {
  const auth = await requireAdmin(request, env);
  if (auth.error) return auth.error;
  await env.DB.prepare(`DELETE FROM advertisements WHERE id = ?`).bind(id).run();
  return ok({}, 'Ad deleted');
}
