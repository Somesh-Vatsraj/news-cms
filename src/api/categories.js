import { ok, fail } from '../utils/response.js';
import { readJson, requireFields, parseIntSafe } from '../utils/validation.js';
import { slugify, uniqueSlug } from '../utils/slug.js';
import { requireAdmin } from '../middleware/auth.js';

export async function list(request, env) {
  const url = new URL(request.url);
  const includeAll = url.searchParams.get('all') === '1';
  const sql = includeAll
    ? `SELECT * FROM categories ORDER BY sort_order ASC, name ASC`
    : `SELECT * FROM categories WHERE status='active' ORDER BY sort_order ASC, name ASC`;
  const rows = await env.DB.prepare(sql).all();
  return ok({ items: rows.results });
}

export async function get(request, env, id) {
  const row = await env.DB.prepare(`SELECT * FROM categories WHERE id = ?`).bind(id).first();
  if (!row) return fail('Not found', 404);
  return ok({ item: row });
}

export async function create(request, env) {
  const auth = await requireAdmin(request, env);
  if (auth.error) return auth.error;
  const b = await readJson(request);
  const missing = requireFields(b, ['name']);
  if (missing.length) return fail('Name is required.', 400);
  const slug = await uniqueSlug(env.DB, 'categories', slugify(b.slug || b.name));
  const res = await env.DB.prepare(
    `INSERT INTO categories (name, slug, description, image, meta_title, meta_description, status, sort_order)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(
    b.name, slug, b.description || '', b.image || '',
    b.meta_title || '', b.meta_description || '',
    b.status === 'inactive' ? 'inactive' : 'active',
    parseIntSafe(b.sort_order, 0)
  ).run();
  return ok({ id: res.meta.last_row_id, slug }, 'Category created');
}

export async function update(request, env, id) {
  const auth = await requireAdmin(request, env);
  if (auth.error) return auth.error;
  const b = await readJson(request);
  const row = await env.DB.prepare(`SELECT * FROM categories WHERE id = ?`).bind(id).first();
  if (!row) return fail('Not found', 404);
  let slug = row.slug;
  if (b.slug && slugify(b.slug) !== row.slug) slug = await uniqueSlug(env.DB, 'categories', slugify(b.slug), id);
  await env.DB.prepare(
    `UPDATE categories SET name=?, slug=?, description=?, image=?, meta_title=?, meta_description=?,
      status=?, sort_order=?, updated_at=datetime('now') WHERE id=?`
  ).bind(
    b.name ?? row.name, slug, b.description ?? row.description, b.image ?? row.image,
    b.meta_title ?? row.meta_title, b.meta_description ?? row.meta_description,
    b.status ?? row.status, parseIntSafe(b.sort_order, row.sort_order), id
  ).run();
  return ok({}, 'Category updated');
}

export async function remove(request, env, id) {
  const auth = await requireAdmin(request, env);
  if (auth.error) return auth.error;
  const countRow = await env.DB.prepare(`SELECT COUNT(*) AS c FROM news WHERE category_id = ?`).bind(id).first();
  if (countRow.c > 0) return fail(`Cannot delete: ${countRow.c} article(s) still use this category. Reassign them first.`, 409);
  await env.DB.prepare(`DELETE FROM categories WHERE id = ?`).bind(id).run();
  return ok({}, 'Category deleted');
}

export async function bySlug(request, env, slug) {
  const row = await env.DB.prepare(`SELECT * FROM categories WHERE slug = ? LIMIT 1`).bind(slug).first();
  if (!row) return fail('Category not found', 404);
  return ok({ category: row });
}
