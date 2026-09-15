import { ok, fail } from '../utils/response.js';
import { readJson, requireFields, parseIntSafe } from '../utils/validation.js';
import { requireAdmin } from '../middleware/auth.js';

export async function list(request, env) {
  const url = new URL(request.url);
  const all = url.searchParams.get('all') === '1';
  const sql = all
    ? `SELECT * FROM navigation ORDER BY sort_order ASC, id ASC`
    : `SELECT * FROM navigation WHERE status='active' ORDER BY sort_order ASC, id ASC`;
  const rows = await env.DB.prepare(sql).all();
  return ok({ items: rows.results });
}

export async function create(request, env) {
  const auth = await requireAdmin(request, env);
  if (auth.error) return auth.error;
  const b = await readJson(request);
  const missing = requireFields(b, ['title','url']);
  if (missing.length) return fail('Title and URL are required.', 400);
  const res = await env.DB.prepare(
    `INSERT INTO navigation (title, url, type, parent_id, sort_order, status) VALUES (?,?,?,?,?,?)`
  ).bind(b.title, b.url, b.type || 'link', b.parent_id || null, parseIntSafe(b.sort_order, 0), b.status || 'active').run();
  return ok({ id: res.meta.last_row_id }, 'Nav item created');
}

export async function update(request, env, id) {
  const auth = await requireAdmin(request, env);
  if (auth.error) return auth.error;
  const b = await readJson(request);
  const row = await env.DB.prepare(`SELECT * FROM navigation WHERE id = ?`).bind(id).first();
  if (!row) return fail('Not found', 404);
  await env.DB.prepare(
    `UPDATE navigation SET title=?, url=?, type=?, parent_id=?, sort_order=?, status=? WHERE id=?`
  ).bind(
    b.title ?? row.title, b.url ?? row.url, b.type ?? row.type,
    b.parent_id ?? row.parent_id, parseIntSafe(b.sort_order, row.sort_order),
    b.status ?? row.status, id
  ).run();
  return ok({}, 'Nav updated');
}

export async function remove(request, env, id) {
  const auth = await requireAdmin(request, env);
  if (auth.error) return auth.error;
  await env.DB.prepare(`DELETE FROM navigation WHERE id = ?`).bind(id).run();
  return ok({}, 'Nav deleted');
}
