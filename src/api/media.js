import { ok, fail } from '../utils/response.js';
import { readJson, requireFields, parseIntSafe } from '../utils/validation.js';
import { requireAdmin } from '../middleware/auth.js';

/**
 * Media abstraction — expects URL to already exist on Cloudflare Images, R2,
 * or any external CDN. This endpoint registers the URL in D1 for management.
 */
export async function list(request, env) {
  const auth = await requireAdmin(request, env);
  if (auth.error) return auth.error;
  const url = new URL(request.url);
  const q = (url.searchParams.get('q') || '').trim();
  const limit = Math.min(parseIntSafe(url.searchParams.get('limit'), 40), 200);
  const page = Math.max(parseIntSafe(url.searchParams.get('page'), 1), 1);
  const offset = (page-1)*limit;

  const where = ['1=1']; const params = [];
  if (q) { where.push(`(filename LIKE ? OR alt_text LIKE ?)`); params.push(`%${q}%`, `%${q}%`); }
  const rows = await env.DB.prepare(
    `SELECT * FROM media WHERE ${where.join(' AND ')} ORDER BY created_at DESC LIMIT ? OFFSET ?`
  ).bind(...params, limit, offset).all();
  const total = await env.DB.prepare(`SELECT COUNT(*) AS c FROM media WHERE ${where.join(' AND ')}`).bind(...params).first();
  return ok({ items: rows.results, total: total.c, page, limit, totalPages: Math.ceil(total.c/limit) });
}

export async function create(request, env) {
  const auth = await requireAdmin(request, env);
  if (auth.error) return auth.error;
  const b = await readJson(request);
  const missing = requireFields(b, ['url']);
  if (missing.length) return fail('URL is required.', 400);
  const filename = b.filename || b.url.split('/').pop() || 'file';
  const res = await env.DB.prepare(
    `INSERT INTO media (filename, url, type, size, alt_text, uploaded_by) VALUES (?,?,?,?,?,?)`
  ).bind(filename, b.url, b.type || 'image', parseIntSafe(b.size, 0), b.alt_text || '', auth.user.id).run();
  return ok({ id: res.meta.last_row_id }, 'Media added');
}

export async function remove(request, env, id) {
  const auth = await requireAdmin(request, env);
  if (auth.error) return auth.error;
  await env.DB.prepare(`DELETE FROM media WHERE id = ?`).bind(id).run();
  return ok({}, 'Media removed');
}
