import { ok, fail } from '../utils/response.js';
import { readJson, requireFields, parseIntSafe, isEmail } from '../utils/validation.js';
import { escapeHtml } from '../utils/sanitize.js';
import { requireAdmin } from '../middleware/auth.js';
import { getCurrentUser } from '../middleware/auth.js';

export async function listForArticle(request, env, newsId) {
  const rows = await env.DB.prepare(
    `SELECT id, name, content, created_at FROM comments
     WHERE news_id = ? AND status = 'approved' ORDER BY created_at DESC LIMIT 100`
  ).bind(newsId).all();
  return ok({ items: rows.results });
}

export async function createForArticle(request, env, newsId) {
  const settings = await env.DB.prepare(`SELECT setting_value FROM settings WHERE setting_key='comments_enabled'`).first();
  if (settings && settings.setting_value === '0') return fail('Comments are disabled.', 403);

  const b = await readJson(request);
  const missing = requireFields(b, ['name', 'email', 'content']);
  if (missing.length) return fail('Name, email and comment are required.', 400);
  if (!isEmail(b.email)) return fail('Invalid email.', 400);
  if (b.content.length > 2000) return fail('Comment too long.', 400);

  const user = await getCurrentUser(request, env);
  const res = await env.DB.prepare(
    `INSERT INTO comments (news_id, user_id, name, email, content, status)
     VALUES (?, ?, ?, ?, ?, 'pending')`
  ).bind(newsId, user?.id || null, b.name.slice(0,80), b.email.toLowerCase(), escapeHtml(b.content)).run();
  return ok({ id: res.meta.last_row_id }, 'Comment submitted for moderation');
}

export async function listAdmin(request, env) {
  const auth = await requireAdmin(request, env);
  if (auth.error) return auth.error;
  const url = new URL(request.url);
  const status = url.searchParams.get('status') || '';
  const q = (url.searchParams.get('q') || '').trim();
  const limit = Math.min(parseIntSafe(url.searchParams.get('limit'), 30), 100);
  const page = Math.max(parseIntSafe(url.searchParams.get('page'), 1), 1);
  const offset = (page-1)*limit;

  const where = ['1=1']; const params = [];
  if (status) { where.push('cm.status = ?'); params.push(status); }
  if (q) { where.push('(cm.content LIKE ? OR cm.name LIKE ? OR n.title LIKE ?)'); params.push(`%${q}%`,`%${q}%`,`%${q}%`); }

  const rows = await env.DB.prepare(
    `SELECT cm.*, n.title AS news_title, n.slug AS news_slug
     FROM comments cm LEFT JOIN news n ON n.id = cm.news_id
     WHERE ${where.join(' AND ')} ORDER BY cm.created_at DESC LIMIT ? OFFSET ?`
  ).bind(...params, limit, offset).all();
  const total = await env.DB.prepare(
    `SELECT COUNT(*) AS c FROM comments cm LEFT JOIN news n ON n.id = cm.news_id WHERE ${where.join(' AND ')}`
  ).bind(...params).first();
  return ok({ items: rows.results, total: total.c, page, limit, totalPages: Math.ceil(total.c/limit) });
}

export async function update(request, env, id) {
  const auth = await requireAdmin(request, env);
  if (auth.error) return auth.error;
  const b = await readJson(request);
  const status = ['pending','approved','rejected','spam'].includes(b.status) ? b.status : null;
  if (!status) return fail('Invalid status', 400);
  await env.DB.prepare(`UPDATE comments SET status = ? WHERE id = ?`).bind(status, id).run();
  return ok({}, 'Comment updated');
}

export async function remove(request, env, id) {
  const auth = await requireAdmin(request, env);
  if (auth.error) return auth.error;
  await env.DB.prepare(`DELETE FROM comments WHERE id = ?`).bind(id).run();
  return ok({}, 'Comment deleted');
}
