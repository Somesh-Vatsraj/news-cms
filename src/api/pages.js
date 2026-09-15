import { ok, fail } from '../utils/response.js';
import { readJson, requireFields } from '../utils/validation.js';
import { slugify, uniqueSlug } from '../utils/slug.js';
import { sanitizeHtml } from '../utils/sanitize.js';
import { requireAdmin } from '../middleware/auth.js';

export async function list(request, env) {
  const rows = await env.DB.prepare(`SELECT * FROM pages ORDER BY title ASC`).all();
  return ok({ items: rows.results });
}

export async function getPublic(request, env, slug) {
  const row = await env.DB.prepare(`SELECT * FROM pages WHERE slug = ? AND status='published' LIMIT 1`).bind(slug).first();
  if (!row) return fail('Page not found', 404);
  return ok({ page: row });
}

export async function create(request, env) {
  const auth = await requireAdmin(request, env);
  if (auth.error) return auth.error;
  const b = await readJson(request);
  const missing = requireFields(b, ['title']);
  if (missing.length) return fail('Title required.', 400);
  const slug = await uniqueSlug(env.DB, 'pages', slugify(b.slug || b.title));
  const res = await env.DB.prepare(
    `INSERT INTO pages (title, slug, content, meta_title, meta_description, status) VALUES (?,?,?,?,?,?)`
  ).bind(b.title, slug, sanitizeHtml(b.content||''), b.meta_title||'', b.meta_description||'', b.status === 'draft' ? 'draft':'published').run();
  return ok({ id: res.meta.last_row_id, slug }, 'Page created');
}

export async function update(request, env, id) {
  const auth = await requireAdmin(request, env);
  if (auth.error) return auth.error;
  const b = await readJson(request);
  const row = await env.DB.prepare(`SELECT * FROM pages WHERE id = ?`).bind(id).first();
  if (!row) return fail('Not found', 404);
  let slug = row.slug;
  if (b.slug && slugify(b.slug) !== row.slug) slug = await uniqueSlug(env.DB, 'pages', slugify(b.slug), id);
  await env.DB.prepare(
    `UPDATE pages SET title=?, slug=?, content=?, meta_title=?, meta_description=?, status=?, updated_at=datetime('now') WHERE id=?`
  ).bind(
    b.title ?? row.title, slug, sanitizeHtml(b.content ?? row.content),
    b.meta_title ?? row.meta_title, b.meta_description ?? row.meta_description,
    b.status ?? row.status, id
  ).run();
  return ok({}, 'Page updated');
}

export async function remove(request, env, id) {
  const auth = await requireAdmin(request, env);
  if (auth.error) return auth.error;
  await env.DB.prepare(`DELETE FROM pages WHERE id = ?`).bind(id).run();
  return ok({}, 'Page deleted');
}
