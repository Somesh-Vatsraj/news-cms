import { ok, fail } from '../utils/response.js';
import { readJson, requireFields } from '../utils/validation.js';
import { slugify, uniqueSlug } from '../utils/slug.js';
import { requireAdmin } from '../middleware/auth.js';

export async function list(request, env) {
  const url = new URL(request.url);
  const all = url.searchParams.get('all') === '1';
  const sql = all
    ? `SELECT * FROM authors ORDER BY name ASC`
    : `SELECT * FROM authors WHERE status='active' ORDER BY name ASC`;
  const rows = await env.DB.prepare(sql).all();
  return ok({ items: rows.results });
}

export async function create(request, env) {
  const auth = await requireAdmin(request, env);
  if (auth.error) return auth.error;
  const b = await readJson(request);
  const missing = requireFields(b, ['name']);
  if (missing.length) return fail('Name is required.', 400);
  const slug = await uniqueSlug(env.DB, 'authors', slugify(b.slug || b.name));
  const res = await env.DB.prepare(
    `INSERT INTO authors (name, slug, bio, avatar, email, social_links, status)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).bind(
    b.name, slug, b.bio || '', b.avatar || '', b.email || '',
    b.social_links ? JSON.stringify(b.social_links) : '', b.status === 'inactive' ? 'inactive' : 'active'
  ).run();
  return ok({ id: res.meta.last_row_id, slug }, 'Author created');
}

export async function update(request, env, id) {
  const auth = await requireAdmin(request, env);
  if (auth.error) return auth.error;
  const b = await readJson(request);
  const row = await env.DB.prepare(`SELECT * FROM authors WHERE id = ?`).bind(id).first();
  if (!row) return fail('Not found', 404);
  let slug = row.slug;
  if (b.slug && slugify(b.slug) !== row.slug) slug = await uniqueSlug(env.DB, 'authors', slugify(b.slug), id);
  await env.DB.prepare(
    `UPDATE authors SET name=?, slug=?, bio=?, avatar=?, email=?, social_links=?, status=?, updated_at=datetime('now') WHERE id=?`
  ).bind(
    b.name ?? row.name, slug, b.bio ?? row.bio, b.avatar ?? row.avatar, b.email ?? row.email,
    b.social_links ? JSON.stringify(b.social_links) : row.social_links,
    b.status ?? row.status, id
  ).run();
  return ok({}, 'Author updated');
}

export async function remove(request, env, id) {
  const auth = await requireAdmin(request, env);
  if (auth.error) return auth.error;
  await env.DB.prepare(`DELETE FROM authors WHERE id = ?`).bind(id).run();
  return ok({}, 'Author deleted');
}

export async function bySlug(request, env, slug) {
  const row = await env.DB.prepare(`SELECT * FROM authors WHERE slug = ? LIMIT 1`).bind(slug).first();
  if (!row) return fail('Author not found', 404);
  return ok({ author: row });
}
