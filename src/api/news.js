import { ok, fail } from '../utils/response.js';
import { readJson, requireFields, parseIntSafe } from '../utils/validation.js';
import { slugify, uniqueSlug } from '../utils/slug.js';
import { sanitizeHtml } from '../utils/sanitize.js';
import { requireAdmin, requireAdminOnly } from '../middleware/auth.js';

function shapeArticle(row) {
  if (!row) return null;
  return {
    id: row.id, title: row.title, slug: row.slug,
    excerpt: row.excerpt, content: row.content,
    featured_image: row.featured_image, thumbnail: row.thumbnail,
    category_id: row.category_id, category_name: row.category_name,
    category_slug: row.category_slug,
    author_id: row.author_id, author_name: row.author_name,
    author_slug: row.author_slug, author_avatar: row.author_avatar,
    status: row.status, visibility: row.visibility,
    is_featured: !!row.is_featured, is_trending: !!row.is_trending, is_breaking: !!row.is_breaking,
    views: row.views,
    meta_title: row.meta_title, meta_description: row.meta_description,
    meta_keywords: row.meta_keywords, canonical_url: row.canonical_url,
    published_at: row.published_at, scheduled_at: row.scheduled_at,
    created_at: row.created_at, updated_at: row.updated_at
  };
}

const SELECT_BASE = `
  SELECT n.*,
         c.name AS category_name, c.slug AS category_slug,
         a.name AS author_name, a.slug AS author_slug, a.avatar AS author_avatar
  FROM news n
  LEFT JOIN categories c ON c.id = n.category_id
  LEFT JOIN authors   a ON a.id = n.author_id
`;

/** Public list (only published + public visibility + published_at <= now) */
export async function listPublic(request, env) {
  const url = new URL(request.url);
  const limit = Math.min(parseIntSafe(url.searchParams.get('limit'), 20), 60);
  const page = Math.max(parseIntSafe(url.searchParams.get('page'), 1), 1);
  const offset = (page - 1) * limit;
  const categorySlug = url.searchParams.get('category');
  const featured = url.searchParams.get('featured');
  const trending = url.searchParams.get('trending');
  const breaking = url.searchParams.get('breaking');

  const where = [`n.status = 'published'`, `n.visibility = 'public'`, `(n.published_at IS NULL OR n.published_at <= datetime('now'))`];
  const params = [];
  if (categorySlug) { where.push(`c.slug = ?`); params.push(categorySlug); }
  if (featured === '1') where.push(`n.is_featured = 1`);
  if (trending === '1') where.push(`n.is_trending = 1`);
  if (breaking === '1') where.push(`n.is_breaking = 1`);

  const sql = `${SELECT_BASE} WHERE ${where.join(' AND ')}
    ORDER BY COALESCE(n.published_at, n.created_at) DESC
    LIMIT ? OFFSET ?`;
  const rows = await env.DB.prepare(sql).bind(...params, limit, offset).all();

  const countSql = `SELECT COUNT(*) AS c FROM news n
    LEFT JOIN categories c ON c.id = n.category_id
    WHERE ${where.join(' AND ')}`;
  const total = await env.DB.prepare(countSql).bind(...params).first();

  return ok({
    items: rows.results.map(shapeArticle),
    page, limit, total: total.c,
    totalPages: Math.ceil(total.c / limit)
  });
}

export async function listTrending(request, env) {
  const url = new URL(request.url);
  const limit = Math.min(parseIntSafe(url.searchParams.get('limit'), 6), 30);
  const rows = await env.DB.prepare(
    `${SELECT_BASE}
     WHERE n.status = 'published' AND n.visibility = 'public'
     ORDER BY n.is_trending DESC, n.views DESC, COALESCE(n.published_at, n.created_at) DESC
     LIMIT ?`
  ).bind(limit).all();
  return ok({ items: rows.results.map(shapeArticle) });
}

export async function getBySlug(request, env, slug) {
  const row = await env.DB.prepare(`${SELECT_BASE} WHERE n.slug = ? LIMIT 1`).bind(slug).first();
  if (!row) return fail('Article not found', 404);
  if (row.status !== 'published' && row.visibility !== 'public') {
    // Allow admins to preview? For public route we 404.
    return fail('Article not found', 404);
  }
  // fire and forget view increment
  env.DB.prepare(`UPDATE news SET views = views + 1 WHERE id = ?`).bind(row.id).run().catch(() => {});
  return ok({ article: shapeArticle(row) });
}

export async function related(request, env, slug) {
  const art = await env.DB.prepare(`SELECT id, category_id FROM news WHERE slug = ? LIMIT 1`).bind(slug).first();
  if (!art) return ok({ items: [] });
  const rows = await env.DB.prepare(
    `${SELECT_BASE}
     WHERE n.status = 'published' AND n.visibility = 'public' AND n.id != ?
       AND (n.category_id = ? OR ? IS NULL)
     ORDER BY COALESCE(n.published_at, n.created_at) DESC LIMIT 4`
  ).bind(art.id, art.category_id, art.category_id).all();
  return ok({ items: rows.results.map(shapeArticle) });
}

/** Admin list — includes drafts, scheduled, etc. */
export async function listAdmin(request, env) {
  const auth = await requireAdmin(request, env);
  if (auth.error) return auth.error;

  const url = new URL(request.url);
  const limit = Math.min(parseIntSafe(url.searchParams.get('limit'), 20), 100);
  const page = Math.max(parseIntSafe(url.searchParams.get('page'), 1), 1);
  const offset = (page - 1) * limit;
  const q = (url.searchParams.get('q') || '').trim();
  const status = url.searchParams.get('status') || '';
  const categoryId = url.searchParams.get('category_id') || '';
  const authorId = url.searchParams.get('author_id') || '';

  const where = ['1=1']; const params = [];
  if (q) { where.push(`(n.title LIKE ? OR n.excerpt LIKE ?)`); params.push(`%${q}%`, `%${q}%`); }
  if (status) { where.push(`n.status = ?`); params.push(status); }
  if (categoryId) { where.push(`n.category_id = ?`); params.push(categoryId); }
  if (authorId) { where.push(`n.author_id = ?`); params.push(authorId); }

  const rows = await env.DB.prepare(
    `${SELECT_BASE} WHERE ${where.join(' AND ')}
     ORDER BY n.created_at DESC LIMIT ? OFFSET ?`
  ).bind(...params, limit, offset).all();

  const total = await env.DB.prepare(
    `SELECT COUNT(*) AS c FROM news n WHERE ${where.join(' AND ')}`
  ).bind(...params).first();

  return ok({
    items: rows.results.map(shapeArticle),
    page, limit, total: total.c, totalPages: Math.ceil(total.c / limit)
  });
}

async function saveTags(env, newsId, tagsString) {
  if (!tagsString) return;
  const names = String(tagsString).split(',').map(s => s.trim()).filter(Boolean).slice(0, 20);
  await env.DB.prepare(`DELETE FROM news_tags WHERE news_id = ?`).bind(newsId).run();
  for (const name of names) {
    const slug = slugify(name);
    if (!slug) continue;
    let tag = await env.DB.prepare(`SELECT id FROM tags WHERE slug = ? LIMIT 1`).bind(slug).first();
    if (!tag) {
      const r = await env.DB.prepare(`INSERT INTO tags (name, slug) VALUES (?, ?)`).bind(name, slug).run();
      tag = { id: r.meta.last_row_id };
    }
    await env.DB.prepare(`INSERT OR IGNORE INTO news_tags (news_id, tag_id) VALUES (?, ?)`).bind(newsId, tag.id).run();
  }
}

export async function create(request, env) {
  const auth = await requireAdmin(request, env);
  if (auth.error) return auth.error;
  const body = await readJson(request);
  const missing = requireFields(body, ['title']);
  if (missing.length) return fail('Title is required.', 400);

  const baseSlug = slugify(body.slug || body.title);
  const slug = await uniqueSlug(env.DB, 'news', baseSlug);

  const status = ['draft','published','scheduled','archived'].includes(body.status) ? body.status : 'draft';
  const visibility = body.visibility === 'private' ? 'private' : 'public';
  let publishedAt = body.published_at || null;
  if (status === 'published' && !publishedAt) publishedAt = new Date().toISOString();

  const content = sanitizeHtml(body.content || '');

  const res = await env.DB.prepare(
    `INSERT INTO news
      (title, slug, excerpt, content, featured_image, thumbnail, category_id, author_id,
       status, visibility, is_featured, is_trending, is_breaking,
       meta_title, meta_description, meta_keywords, canonical_url,
       published_at, scheduled_at)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
  ).bind(
    body.title, slug, body.excerpt || '', content,
    body.featured_image || '', body.thumbnail || '',
    body.category_id || null, body.author_id || null,
    status, visibility,
    body.is_featured ? 1 : 0, body.is_trending ? 1 : 0, body.is_breaking ? 1 : 0,
    body.meta_title || '', body.meta_description || '', body.meta_keywords || '', body.canonical_url || '',
    publishedAt, body.scheduled_at || null
  ).run();

  const id = res.meta.last_row_id;
  await saveTags(env, id, body.tags);
  await env.DB.prepare(
    `INSERT INTO activity_logs (user_id, action, entity_type, entity_id) VALUES (?, 'create_news', 'news', ?)`
  ).bind(auth.user.id, id).run();

  return ok({ id, slug }, 'Article created');
}

export async function update(request, env, id) {
  const auth = await requireAdmin(request, env);
  if (auth.error) return auth.error;
  const body = await readJson(request);
  const existing = await env.DB.prepare(`SELECT * FROM news WHERE id = ?`).bind(id).first();
  if (!existing) return fail('Not found', 404);

  let slug = existing.slug;
  if (body.slug && slugify(body.slug) !== existing.slug) {
    slug = await uniqueSlug(env.DB, 'news', slugify(body.slug), id);
  } else if (body.title && (!body.slug)) {
    // keep slug stable unless explicitly changed — safer
  }

  const status = ['draft','published','scheduled','archived'].includes(body.status) ? body.status : existing.status;
  const visibility = body.visibility === 'private' ? 'private' : 'public';
  const content = sanitizeHtml(body.content ?? existing.content);
  let publishedAt = body.published_at || existing.published_at;
  if (status === 'published' && !publishedAt) publishedAt = new Date().toISOString();

  await env.DB.prepare(
    `UPDATE news SET
      title=?, slug=?, excerpt=?, content=?, featured_image=?, thumbnail=?,
      category_id=?, author_id=?, status=?, visibility=?,
      is_featured=?, is_trending=?, is_breaking=?,
      meta_title=?, meta_description=?, meta_keywords=?, canonical_url=?,
      published_at=?, scheduled_at=?, updated_at=datetime('now')
     WHERE id=?`
  ).bind(
    body.title ?? existing.title, slug, body.excerpt ?? existing.excerpt, content,
    body.featured_image ?? existing.featured_image, body.thumbnail ?? existing.thumbnail,
    body.category_id ?? existing.category_id, body.author_id ?? existing.author_id,
    status, visibility,
    (body.is_featured ?? existing.is_featured) ? 1 : 0,
    (body.is_trending ?? existing.is_trending) ? 1 : 0,
    (body.is_breaking ?? existing.is_breaking) ? 1 : 0,
    body.meta_title ?? existing.meta_title, body.meta_description ?? existing.meta_description,
    body.meta_keywords ?? existing.meta_keywords, body.canonical_url ?? existing.canonical_url,
    publishedAt, body.scheduled_at ?? existing.scheduled_at,
    id
  ).run();

  if (body.tags !== undefined) await saveTags(env, id, body.tags);
  await env.DB.prepare(
    `INSERT INTO activity_logs (user_id, action, entity_type, entity_id) VALUES (?, 'update_news', 'news', ?)`
  ).bind(auth.user.id, id).run();

  return ok({ id, slug }, 'Article updated');
}

export async function getById(request, env, id) {
  const auth = await requireAdmin(request, env);
  if (auth.error) return auth.error;
  const row = await env.DB.prepare(`${SELECT_BASE} WHERE n.id = ? LIMIT 1`).bind(id).first();
  if (!row) return fail('Not found', 404);
  const tags = await env.DB.prepare(
    `SELECT t.name FROM tags t JOIN news_tags nt ON nt.tag_id = t.id WHERE nt.news_id = ?`
  ).bind(id).all();
  return ok({ article: shapeArticle(row), tags: tags.results.map(t => t.name).join(', ') });
}

export async function remove(request, env, id) {
  const auth = await requireAdmin(request, env);
  if (auth.error) return auth.error;
  const row = await env.DB.prepare(`SELECT id, title FROM news WHERE id = ?`).bind(id).first();
  if (!row) return fail('Not found', 404);
  await env.DB.prepare(`DELETE FROM news WHERE id = ?`).bind(id).run();
  await env.DB.prepare(
    `INSERT INTO activity_logs (user_id, action, entity_type, entity_id) VALUES (?, 'delete_news', 'news', ?)`
  ).bind(auth.user.id, id).run();
  return ok({}, 'Article deleted');
}

export async function bulk(request, env) {
  const auth = await requireAdmin(request, env);
  if (auth.error) return auth.error;
  const body = await readJson(request);
  const ids = Array.isArray(body.ids) ? body.ids.map(Number).filter(Boolean) : [];
  const action = body.action;
  if (!ids.length) return fail('No items selected.', 400);
  const placeholders = ids.map(() => '?').join(',');

  if (action === 'delete') {
    await env.DB.prepare(`DELETE FROM news WHERE id IN (${placeholders})`).bind(...ids).run();
  } else if (action === 'publish') {
    await env.DB.prepare(`UPDATE news SET status='published', published_at=COALESCE(published_at, datetime('now')), updated_at=datetime('now') WHERE id IN (${placeholders})`).bind(...ids).run();
  } else if (action === 'archive') {
    await env.DB.prepare(`UPDATE news SET status='archived', updated_at=datetime('now') WHERE id IN (${placeholders})`).bind(...ids).run();
  } else if (action === 'feature') {
    await env.DB.prepare(`UPDATE news SET is_featured=1, updated_at=datetime('now') WHERE id IN (${placeholders})`).bind(...ids).run();
  } else if (action === 'unfeature') {
    await env.DB.prepare(`UPDATE news SET is_featured=0, updated_at=datetime('now') WHERE id IN (${placeholders})`).bind(...ids).run();
  } else if (action === 'trend') {
    await env.DB.prepare(`UPDATE news SET is_trending=1, updated_at=datetime('now') WHERE id IN (${placeholders})`).bind(...ids).run();
  } else if (action === 'untrend') {
    await env.DB.prepare(`UPDATE news SET is_trending=0, updated_at=datetime('now') WHERE id IN (${placeholders})`).bind(...ids).run();
  } else if (action === 'break') {
    await env.DB.prepare(`UPDATE news SET is_breaking=1, updated_at=datetime('now') WHERE id IN (${placeholders})`).bind(...ids).run();
  } else if (action === 'unbreak') {
    await env.DB.prepare(`UPDATE news SET is_breaking=0, updated_at=datetime('now') WHERE id IN (${placeholders})`).bind(...ids).run();
  } else {
    return fail('Unknown action', 400);
  }
  return ok({}, 'Bulk action applied');
}

export async function duplicate(request, env, id) {
  const auth = await requireAdmin(request, env);
  if (auth.error) return auth.error;
  const row = await env.DB.prepare(`SELECT * FROM news WHERE id = ?`).bind(id).first();
  if (!row) return fail('Not found', 404);
  const newSlug = await uniqueSlug(env.DB, 'news', `${row.slug}-copy`);
  const res = await env.DB.prepare(
    `INSERT INTO news (title, slug, excerpt, content, featured_image, thumbnail, category_id, author_id,
      status, visibility, meta_title, meta_description, meta_keywords, canonical_url)
     VALUES (?,?,?,?,?,?,?,?, 'draft', 'public', ?,?,?,?)`
  ).bind(
    `${row.title} (Copy)`, newSlug, row.excerpt, row.content,
    row.featured_image, row.thumbnail, row.category_id, row.author_id,
    row.meta_title, row.meta_description, row.meta_keywords, row.canonical_url
  ).run();
  return ok({ id: res.meta.last_row_id, slug: newSlug }, 'Duplicated');
}

/** Publish any scheduled news whose scheduled_at has arrived. Called from index.js */
export async function autoPublishScheduled(env) {
  try {
    await env.DB.prepare(
      `UPDATE news SET status='published',
                       published_at=COALESCE(published_at, scheduled_at),
                       updated_at=datetime('now')
       WHERE status='scheduled' AND scheduled_at IS NOT NULL AND scheduled_at <= datetime('now')`
    ).run();
  } catch (e) { /* swallow */ }
}
