import { createRouter } from './router.js';
import { json, ok, fail, html, text, redirect, setCookie } from './utils/response.js';
import { getCurrentUser, SESSION_COOKIE } from './middleware/auth.js';
import { guardAdminHtml } from './middleware/admin.js';
import { loadSettingsMap } from './api/settings.js';

import * as authApi from './api/auth.js';
import * as newsApi from './api/news.js';
import * as categoriesApi from './api/categories.js';
import * as authorsApi from './api/authors.js';
import * as usersApi from './api/users.js';
import * as commentsApi from './api/comments.js';
import * as mediaApi from './api/media.js';
import * as adsApi from './api/ads.js';
import * as pagesApi from './api/pages.js';
import * as settingsApi from './api/settings.js';
import * as navigationApi from './api/navigation.js';
import * as newsletterApi from './api/newsletter.js';
import * as dashboardApi from './api/dashboard.js';
import * as seoApi from './api/seo.js';

import { renderHome } from './views/public/home.js';
import { renderArticle } from './views/public/article.js';
import { renderCategory } from './views/public/category.js';
import { renderSearch } from './views/public/search.js';
import { renderStaticPage, renderError } from './views/public/page.js';
import { renderLogin, renderSetup } from './views/admin/login.js';
import { renderDashboard, renderListPage, renderNewsEditor } from './views/admin/pages.js';

import { PUBLIC_CSS } from './assets/css.js';
import { ADMIN_CSS } from './assets/css.js';
import { PUBLIC_JS } from './assets/app.js.js';
import { ADMIN_JS } from './assets/admin.js.js';
import { EDITOR_JS } from './assets/editor.js.js';

const router = createRouter();

/* ============ STATIC ASSETS ============ */
router.get('/css/main.css', () => text(PUBLIC_CSS, 'text/css; charset=utf-8'));
router.get('/css/admin.css', () => text(ADMIN_CSS, 'text/css; charset=utf-8'));
router.get('/js/app.js', () => text(PUBLIC_JS, 'application/javascript; charset=utf-8'));
router.get('/js/admin.js', () => text(ADMIN_JS, 'application/javascript; charset=utf-8'));
router.get('/js/editor.js', () => text(EDITOR_JS, 'application/javascript; charset=utf-8'));

/* ============ SEO ============ */
router.get('/robots.txt', (req, env) => seoApi.robots(req, env));
router.get('/sitemap.xml', (req, env) => seoApi.sitemap(req, env));

/* ============ AUTH API ============ */
router.post('/api/auth/login', (req, env) => authApi.login(req, env));
router.post('/api/auth/logout', (req, env) => authApi.logout(req, env));
router.get('/api/auth/me', (req, env) => authApi.me(req, env));
router.post('/api/auth/register', (req, env) => authApi.register(req, env));
router.post('/api/auth/change-password', (req, env) => authApi.changePassword(req, env));
router.put('/api/auth/profile', (req, env) => authApi.updateProfile(req, env));
router.get('/api/auth/setup-status', (req, env) => authApi.setupStatus(req, env));
router.post('/api/auth/setup', (req, env) => authApi.setup(req, env));

/* ============ PUBLIC API ============ */
router.get('/api/news', (req, env) => newsApi.listPublic(req, env));
router.get('/api/news/trending', (req, env) => newsApi.listTrending(req, env));
router.get('/api/news/admin/list', (req, env) => newsApi.listAdmin(req, env));
router.get('/api/news/:slug', (req, env, params) => newsApi.getBySlug(req, env, params.slug));
router.get('/api/news/:slug/related', (req, env, params) => newsApi.related(req, env, params.slug));
router.get('/api/news/:id/comments', (req, env, params) => commentsApi.listForArticle(req, env, params.id));
router.post('/api/news/:id/comments', (req, env, params) => commentsApi.createForArticle(req, env, params.id));
router.post('/api/news', (req, env) => newsApi.create(req, env));
router.post('/api/news/bulk', (req, env) => newsApi.bulk(req, env));
router.post('/api/news/:id/duplicate', (req, env, params) => newsApi.duplicate(req, env, params.id));
router.get('/api/news/id/:id', (req, env, params) => newsApi.getById(req, env, params.id));
router.put('/api/news/:id', (req, env, params) => newsApi.update(req, env, params.id));
router.delete('/api/news/:id', (req, env, params) => newsApi.remove(req, env, params.id));

router.get('/api/categories', (req, env) => categoriesApi.list(req, env));
router.get('/api/categories/:id', (req, env, params) => categoriesApi.get(req, env, params.id));
router.post('/api/categories', (req, env) => categoriesApi.create(req, env));
router.put('/api/categories/:id', (req, env, params) => categoriesApi.update(req, env, params.id));
router.delete('/api/categories/:id', (req, env, params) => categoriesApi.remove(req, env, params.id));

router.get('/api/authors', (req, env) => authorsApi.list(req, env));
router.post('/api/authors', (req, env) => authorsApi.create(req, env));
router.put('/api/authors/:id', (req, env, params) => authorsApi.update(req, env, params.id));
router.delete('/api/authors/:id', (req, env, params) => authorsApi.remove(req, env, params.id));

router.get('/api/users', (req, env) => usersApi.list(req, env));
router.post('/api/users', (req, env) => usersApi.create(req, env));
router.put('/api/users/:id', (req, env, params) => usersApi.update(req, env, params.id));
router.delete('/api/users/:id', (req, env, params) => usersApi.remove(req, env, params.id));

router.get('/api/comments', (req, env) => commentsApi.listAdmin(req, env));
router.put('/api/comments/:id', (req, env, params) => commentsApi.update(req, env, params.id));
router.delete('/api/comments/:id', (req, env, params) => commentsApi.remove(req, env, params.id));

router.get('/api/media', (req, env) => mediaApi.list(req, env));
router.post('/api/media', (req, env) => mediaApi.create(req, env));
router.delete('/api/media/:id', (req, env, params) => mediaApi.remove(req, env, params.id));

router.get('/api/ads', (req, env) => adsApi.list(req, env));
router.get('/api/ads/position/:pos', (req, env, params) => adsApi.byPosition(req, env, params.pos));
router.post('/api/ads', (req, env) => adsApi.create(req, env));
router.put('/api/ads/:id', (req, env, params) => adsApi.update(req, env, params.id));
router.delete('/api/ads/:id', (req, env, params) => adsApi.remove(req, env, params.id));

router.get('/api/pages', (req, env) => pagesApi.list(req, env));
router.get('/api/pages/:slug', (req, env, params) => pagesApi.getPublic(req, env, params.slug));
router.post('/api/pages', (req, env) => pagesApi.create(req, env));
router.put('/api/pages/:id', (req, env, params) => pagesApi.update(req, env, params.id));
router.delete('/api/pages/:id', (req, env, params) => pagesApi.remove(req, env, params.id));

router.get('/api/settings', (req, env) => settingsApi.list(req, env));
router.put('/api/settings', (req, env) => settingsApi.update(req, env));

router.get('/api/navigation', (req, env) => navigationApi.list(req, env));
router.post('/api/navigation', (req, env) => navigationApi.create(req, env));
router.put('/api/navigation/:id', (req, env, params) => navigationApi.update(req, env, params.id));
router.delete('/api/navigation/:id', (req, env, params) => navigationApi.remove(req, env, params.id));

router.post('/api/newsletter/subscribe', (req, env) => newsletterApi.subscribe(req, env));
router.get('/api/newsletter', (req, env) => newsletterApi.list(req, env));
router.delete('/api/newsletter/:id', (req, env, params) => newsletterApi.remove(req, env, params.id));

router.get('/api/dashboard/stats', (req, env) => dashboardApi.stats(req, env));
router.get('/api/dashboard/logs', (req, env) => dashboardApi.logs(req, env));

/* ============ ADMIN HTML ROUTES ============ */
router.get('/admin/login', (req, env) => {
  const url = new URL(req.url);
  return html(renderLogin({ next: url.searchParams.get('next') || '/admin' }));
});

router.get('/admin', async (req, env) => {
  const guard = await guardAdminHtml(req, env);
  if (guard.redirectTo) return redirect(guard.redirectTo);
  return html(renderDashboard({ user: guard.user, path: '/admin' }));
});

router.get('/admin/news', async (req, env) => {
  const guard = await guardAdminHtml(req, env);
  if (guard.redirectTo) return redirect(guard.redirectTo);
  return html(renderListPage({ user: guard.user, path: '/admin/news', title: 'Manage News', pageKey: 'news' }));
});

router.get('/admin/news/new', async (req, env) => {
  const guard = await guardAdminHtml(req, env);
  if (guard.redirectTo) return redirect(guard.redirectTo);
  const [cats, authors] = await Promise.all([
    env.DB.prepare(`SELECT * FROM categories ORDER BY name`).all(),
    env.DB.prepare(`SELECT * FROM authors ORDER BY name`).all()
  ]);
  return html(renderNewsEditor({
    user: guard.user, path: '/admin/news/new',
    article: null, categories: cats.results, authors: authors.results, tags: ''
  }));
});

router.get('/admin/news/edit/:id', async (req, env, params) => {
  const guard = await guardAdminHtml(req, env);
  if (guard.redirectTo) return redirect(guard.redirectTo);
  const id = params.id;
  const [art, cats, authors, tags] = await Promise.all([
    env.DB.prepare(`SELECT * FROM news WHERE id = ?`).bind(id).first(),
    env.DB.prepare(`SELECT * FROM categories ORDER BY name`).all(),
    env.DB.prepare(`SELECT * FROM authors ORDER BY name`).all(),
    env.DB.prepare(`SELECT t.name FROM tags t JOIN news_tags nt ON nt.tag_id=t.id WHERE nt.news_id = ?`).bind(id).all()
  ]);
  if (!art) return html(renderError({ settings: await loadSettingsMap(env), navItems: [], adsByPosition: {}, code: 404, message: 'Article not found' }), 404);
  return html(renderNewsEditor({
    user: guard.user, path: `/admin/news/edit/${id}`,
    article: art, categories: cats.results, authors: authors.results,
    tags: tags.results.map(t => t.name).join(', ')
  }));
});

router.get('/admin/categories', async (req, env) => {
  const guard = await guardAdminHtml(req, env);
  if (guard.redirectTo) return redirect(guard.redirectTo);
  return html(renderListPage({ user: guard.user, path: '/admin/categories', title: 'Categories', pageKey: 'categories' }));
});

router.get('/admin/authors', async (req, env) => {
  const guard = await guardAdminHtml(req, env);
  if (guard.redirectTo) return redirect(guard.redirectTo);
  return html(renderListPage({ user: guard.user, path: '/admin/authors', title: 'Authors', pageKey: 'authors' }));
});

router.get('/admin/users', async (req, env) => {
  const guard = await guardAdminHtml(req, env, ['admin']);
  if (guard.redirectTo) return redirect(guard.redirectTo);
  return html(renderListPage({ user: guard.user, path: '/admin/users', title: 'Users', pageKey: 'users' }));
});

router.get('/admin/comments', async (req, env) => {
  const guard = await guardAdminHtml(req, env);
  if (guard.redirectTo) return redirect(guard.redirectTo);
  return html(renderListPage({ user: guard.user, path: '/admin/comments', title: 'Comments', pageKey: 'comments' }));
});

router.get('/admin/media', async (req, env) => {
  const guard = await guardAdminHtml(req, env);
  if (guard.redirectTo) return redirect(guard.redirectTo);
  return html(renderListPage({ user: guard.user, path: '/admin/media', title: 'Media Library', pageKey: 'media' }));
});

router.get('/admin/advertisements', async (req, env) => {
  const guard = await guardAdminHtml(req, env);
  if (guard.redirectTo) return redirect(guard.redirectTo);
  return html(renderListPage({ user: guard.user, path: '/admin/advertisements', title: 'Advertisements', pageKey: 'advertisements' }));
});

router.get('/admin/pages', async (req, env) => {
  const guard = await guardAdminHtml(req, env);
  if (guard.redirectTo) return redirect(guard.redirectTo);
  return html(renderListPage({ user: guard.user, path: '/admin/pages', title: 'Pages', pageKey: 'pages' }));
});

router.get('/admin/navigation', async (req, env) => {
  const guard = await guardAdminHtml(req, env);
  if (guard.redirectTo) return redirect(guard.redirectTo);
  return html(renderListPage({ user: guard.user, path: '/admin/navigation', title: 'Navigation', pageKey: 'navigation' }));
});

router.get('/admin/seo', async (req, env) => {
  const guard = await guardAdminHtml(req, env);
  if (guard.redirectTo) return redirect(guard.redirectTo);
  return html(renderListPage({ user: guard.user, path: '/admin/seo', title: 'SEO', pageKey: 'seo' }));
});

router.get('/admin/settings', async (req, env) => {
  const guard = await guardAdminHtml(req, env, ['admin']);
  if (guard.redirectTo) return redirect(guard.redirectTo);
  return html(renderListPage({ user: guard.user, path: '/admin/settings', title: 'Settings', pageKey: 'settings' }));
});

/* ============ PUBLIC HTML ROUTES ============ */
router.get('/', async (req, env) => {
  const settings = await loadSettingsMap(env);
  if (settings.maintenance_mode === '1') {
    return html(renderError({ settings, navItems: [], adsByPosition: {}, code: 503, message: 'Site Under Maintenance' }), 503);
  }
  const [nav, cats, hero, latest, trending, featured, sidebarAds, headerAds, middleAds] = await Promise.all([
    env.DB.prepare(`SELECT * FROM navigation WHERE status='active' ORDER BY sort_order`).all(),
    env.DB.prepare(`SELECT * FROM categories WHERE status='active' ORDER BY sort_order LIMIT 6`).all(),
    env.DB.prepare(`SELECT n.*, c.name AS category_name, c.slug AS category_slug, a.name AS author_name FROM news n LEFT JOIN categories c ON c.id=n.category_id LEFT JOIN authors a ON a.id=n.author_id WHERE n.status='published' AND n.visibility='public' ORDER BY n.is_featured DESC, COALESCE(n.published_at,n.created_at) DESC LIMIT 1`).first(),
    env.DB.prepare(`SELECT n.*, c.name AS category_name, c.slug AS category_slug, a.name AS author_name FROM news n LEFT JOIN categories c ON c.id=n.category_id LEFT JOIN authors a ON a.id=n.author_id WHERE n.status='published' AND n.visibility='public' ORDER BY COALESCE(n.published_at,n.created_at) DESC LIMIT 8`).all(),
    env.DB.prepare(`SELECT n.*, c.name AS category_name FROM news n LEFT JOIN categories c ON c.id=n.category_id WHERE n.status='published' AND n.visibility='public' ORDER BY n.is_trending DESC, n.views DESC LIMIT 6`).all(),
    env.DB.prepare(`SELECT n.*, c.name AS category_name, c.slug AS category_slug, a.name AS author_name FROM news n LEFT JOIN categories c ON c.id=n.category_id LEFT JOIN authors a ON a.id=n.author_id WHERE n.status='published' AND n.visibility='public' AND n.is_featured=1 ORDER BY COALESCE(n.published_at,n.created_at) DESC LIMIT 6`).all(),
    env.DB.prepare(`SELECT * FROM advertisements WHERE position='sidebar' AND status='active'`).all(),
    env.DB.prepare(`SELECT * FROM advertisements WHERE position='header' AND status='active'`).all(),
    env.DB.prepare(`SELECT * FROM advertisements WHERE position='homepage_middle' AND status='active'`).all()
  ]);

  // side hero = latest except first
  const sideHero = latest.results.slice(1, 5);

  // category sections
  const categorySections = [];
  for (const c of cats.results.slice(0, 3)) {
    const items = await env.DB.prepare(
      `SELECT n.*, c.name AS category_name, c.slug AS category_slug, a.name AS author_name
       FROM news n LEFT JOIN categories c ON c.id=n.category_id LEFT JOIN authors a ON a.id=n.author_id
       WHERE n.status='published' AND n.visibility='public' AND n.category_id = ?
       ORDER BY COALESCE(n.published_at,n.created_at) DESC LIMIT 3`
    ).bind(c.id).all();
    if (items.results.length) categorySections.push({ ...c, items: items.results });
  }

  // popular
  const popular = await env.DB.prepare(
    `SELECT n.*, c.name AS category_name FROM news n LEFT JOIN categories c ON c.id=n.category_id
     WHERE n.status='published' AND n.visibility='public' ORDER BY n.views DESC LIMIT 5`
  ).all();

  // breaking
  const breaking = await env.DB.prepare(
    `SELECT n.title, n.slug FROM news n WHERE n.status='published' AND n.visibility='public' AND n.is_breaking=1
     ORDER BY COALESCE(n.published_at,n.created_at) DESC LIMIT 5`
  ).all();

  return html(renderHome({
    settings,
    navItems: nav.results,
    adsByPosition: { _breaking: breaking.results, _categories: cats.results },
    data: {
      hero, sideHero, latest: latest.results, trending: trending.results,
      featured: featured.results, categories: categorySections, popular: popular.results,
      sidebarAds: sidebarAds.results, headerAds: headerAds.results, middleAds: middleAds.results
    }
  }));
});

router.get('/news/:slug', async (req, env, params) => {
  const slug = params.slug;
  const settings = await loadSettingsMap(env);
  const [article, nav, related, popular, comments, sideAds, artTop, artMid, artBot, cat] = await Promise.all([
    env.DB.prepare(
      `SELECT n.*, c.name AS category_name, c.slug AS category_slug, a.name AS author_name, a.slug AS author_slug, a.avatar AS author_avatar
       FROM news n LEFT JOIN categories c ON c.id=n.category_id LEFT JOIN authors a ON a.id=n.author_id WHERE n.slug = ? LIMIT 1`
    ).bind(slug).first(),
    env.DB.prepare(`SELECT * FROM navigation WHERE status='active' ORDER BY sort_order`).all(),
    env.DB.prepare(
      `SELECT n.*, c.name AS category_name FROM news n LEFT JOIN categories c ON c.id=n.category_id
       WHERE n.status='published' AND n.visibility='public' AND n.id != (SELECT id FROM news WHERE slug = ?)
       ORDER BY COALESCE(n.published_at,n.created_at) DESC LIMIT 3`
    ).bind(slug).all(),
    env.DB.prepare(
      `SELECT n.*, c.name AS category_name FROM news n LEFT JOIN categories c ON c.id=n.category_id
       WHERE n.status='published' AND n.visibility='public' ORDER BY n.views DESC LIMIT 5`
    ).all(),
    env.DB.prepare(`SELECT id, name, content, created_at FROM comments WHERE news_id = (SELECT id FROM news WHERE slug = ?) AND status='approved' ORDER BY created_at DESC LIMIT 50`).bind(slug).all(),
    env.DB.prepare(`SELECT * FROM advertisements WHERE position='sidebar' AND status='active'`).all(),
    env.DB.prepare(`SELECT * FROM advertisements WHERE position='article_top' AND status='active'`).all(),
    env.DB.prepare(`SELECT * FROM advertisements WHERE position='article_middle' AND status='active'`).all(),
    env.DB.prepare(`SELECT * FROM advertisements WHERE position='article_bottom' AND status='active'`).all(),
    env.DB.prepare(`SELECT name, slug, description, meta_title, meta_description FROM categories WHERE id = (SELECT category_id FROM news WHERE slug = ?)`).bind(slug).first()
  ]);

  if (!article) {
    return html(renderError({ settings, navItems: nav.results, adsByPosition: {}, code: 404, message: 'Article Not Found' }), 404);
  }
  if (article.status !== 'published' && article.visibility !== 'public') {
    return html(renderError({ settings, navItems: nav.results, adsByPosition: {}, code: 404, message: 'Article Not Found' }), 404);
  }

  // increment views
  await env.DB.prepare(`UPDATE news SET views = views + 1 WHERE id = ?`).bind(article.id).run();
  article.views += 1;

  const siteUrl = env.SITE_URL || new URL(req.url).origin;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    image: article.featured_image ? [article.featured_image] : [],
    datePublished: article.published_at || article.created_at,
    dateModified: article.updated_at || article.created_at,
    author: [{ '@type': 'Person', name: article.author_name || 'Staff' }],
    publisher: {
      '@type': 'Organization',
      name: settings.site_name || 'NewsHub'
    },
    mainEntityOfPage: `${siteUrl}/news/${article.slug}`
  };

  return html(renderArticle({
    settings, navItems: nav.results, adsByPosition: {},
    article, related: related.results, popular: popular.results,
    comments: comments.results,
    ads: { sidebar: sideAds.results, top: artTop.results, middle: artMid.results, bottom: artBot.results },
    jsonLd
  }));
});

router.get('/category/:slug', async (req, env, params) => {
  const url = new URL(req.url);
  const page = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10));
  const limit = 12;
  const offset = (page - 1) * limit;
  const settings = await loadSettingsMap(env);
  const [cat, nav, sideAds, popular] = await Promise.all([
    env.DB.prepare(`SELECT * FROM categories WHERE slug = ? LIMIT 1`).bind(params.slug).first(),
    env.DB.prepare(`SELECT * FROM navigation WHERE status='active' ORDER BY sort_order`).all(),
    env.DB.prepare(`SELECT * FROM advertisements WHERE position='sidebar' AND status='active'`).all(),
    env.DB.prepare(`SELECT n.*, c.name AS category_name FROM news n LEFT JOIN categories c ON c.id=n.category_id
      WHERE n.status='published' AND n.visibility='public' ORDER BY n.views DESC LIMIT 5`).all()
  ]);
  if (!cat) return html(renderError({ settings, navItems: nav.results, adsByPosition: {}, code: 404, message: 'Category Not Found' }), 404);

  const [items, total] = await Promise.all([
    env.DB.prepare(
      `SELECT n.*, c.name AS category_name, a.name AS author_name FROM news n
       LEFT JOIN categories c ON c.id=n.category_id LEFT JOIN authors a ON a.id=n.author_id
       WHERE n.status='published' AND n.visibility='public' AND n.category_id = ?
       ORDER BY COALESCE(n.published_at,n.created_at) DESC LIMIT ? OFFSET ?`
    ).bind(cat.id, limit, offset).all(),
    env.DB.prepare(
      `SELECT COUNT(*) AS c FROM news WHERE status='published' AND visibility='public' AND category_id = ?`
    ).bind(cat.id).first()
  ]);
  return html(renderCategory({
    settings, navItems: nav.results, adsByPosition: {},
    category: cat, items: items.results,
    pagination: { page, limit, total: total.c, totalPages: Math.ceil(total.c / limit) },
    sidebarAds: sideAds.results, popular: popular.results
  }));
});

router.get('/search', async (req, env) => {
  const url = new URL(req.url);
  const q = (url.searchParams.get('q') || '').trim();
  const activeCategory = url.searchParams.get('category') || '';
  const page = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10));
  const limit = 12;
  const offset = (page - 1) * limit;
  const settings = await loadSettingsMap(env);
  const [nav, cats] = await Promise.all([
    env.DB.prepare(`SELECT * FROM navigation WHERE status='active' ORDER BY sort_order`).all(),
    env.DB.prepare(`SELECT * FROM categories WHERE status='active' ORDER BY name`).all()
  ]);

  const where = [`n.status='published'`, `n.visibility='public'`];
  const params = [];
  if (q) {
    where.push(`(n.title LIKE ? OR n.excerpt LIKE ? OR n.content LIKE ?)`);
    params.push(`%${q}%`, `%${q}%`, `%${q}%`);
  }
  if (activeCategory) { where.push(`c.slug = ?`); params.push(activeCategory); }

  const [items, total] = await Promise.all([
    env.DB.prepare(
      `SELECT n.*, c.name AS category_name, c.slug AS category_slug, a.name AS author_name FROM news n
       LEFT JOIN categories c ON c.id=n.category_id LEFT JOIN authors a ON a.id=n.author_id
       WHERE ${where.join(' AND ')} ORDER BY COALESCE(n.published_at,n.created_at) DESC LIMIT ? OFFSET ?`
    ).bind(...params, limit, offset).all(),
    env.DB.prepare(
      `SELECT COUNT(*) AS c FROM news n LEFT JOIN categories c ON c.id=n.category_id WHERE ${where.join(' AND ')}`
    ).bind(...params).first()
  ]);
  return html(renderSearch({
    settings, navItems: nav.results, adsByPosition: {},
    query: q, items: items.results,
    pagination: { page, limit, total: total.c, totalPages: Math.ceil(total.c / limit) },
    categories: cats.results, activeCategory
  }));
});

router.get('/author/:slug', async (req, env, params) => {
  const settings = await loadSettingsMap(env);
  const [author, nav] = await Promise.all([
    env.DB.prepare(`SELECT * FROM authors WHERE slug = ? LIMIT 1`).bind(params.slug).first(),
    env.DB.prepare(`SELECT * FROM navigation WHERE status='active' ORDER BY sort_order`).all()
  ]);
  if (!author) return html(renderError({ settings, navItems: nav.results, adsByPosition: {}, code: 404, message: 'Author not found' }), 404);
  const items = await env.DB.prepare(
    `SELECT n.*, c.name AS category_name FROM news n LEFT JOIN categories c ON c.id=n.category_id
     WHERE n.author_id = ? AND n.status='published' AND n.visibility='public'
     ORDER BY COALESCE(n.published_at,n.created_at) DESC LIMIT 20`
  ).bind(author.id).all();

  const body = `<div class="container" style="padding:36px 0">
    <div style="display:flex;gap:18px;align-items:center;margin-bottom:26px">
      <div style="width:80px;height:80px;border-radius:50%;background:var(--light-purple);display:grid;place-items:center;font-size:30px;font-weight:800;color:var(--primary-dark);overflow:hidden">
        ${author.avatar ? `<img src="${author.avatar}" alt="" style="width:100%;height:100%;object-fit:cover">` : author.name[0]}
      </div>
      <div><h1 style="font-size:28px;font-weight:800;margin-bottom:4px">${author.name}</h1>
      <p style="color:var(--muted)">${author.bio || ''}</p></div>
    </div>
    <div class="grid-3">
      ${items.results.map(a => `<article class="card">
        <a href="/news/${a.slug}" class="card-img"><img src="${a.featured_image || a.thumbnail || 'https://placehold.co/600x400/f3e8ff/8b5cf6?text='}" alt="${a.title}" loading="lazy"></a>
        <div class="card-body">
          ${a.category_name ? `<span class="badge">${a.category_name}</span>` : ''}
          <h3><a href="/news/${a.slug}">${a.title}</a></h3>
        </div>
      </article>`).join('')}
    </div></div>`;

  const { renderPublicLayout } = await import('./views/layout.js');
  return html(renderPublicLayout({
    settings, navItems: nav.results, adsByPosition: {}, body,
    title: author.name, meta: { description: author.bio }, path: `/author/${author.slug}`
  }));
});

router.get('/page/:slug', async (req, env, params) => {
  const settings = await loadSettingsMap(env);
  const [page, nav] = await Promise.all([
    env.DB.prepare(`SELECT * FROM pages WHERE slug = ? AND status='published' LIMIT 1`).bind(params.slug).first(),
    env.DB.prepare(`SELECT * FROM navigation WHERE status='active' ORDER BY sort_order`).all()
  ]);
  if (!page) return html(renderError({ settings, navItems: nav.results, adsByPosition: {}, code: 404, message: 'Page Not Found' }), 404);
  return html(renderStaticPage({ settings, navItems: nav.results, adsByPosition: {}, page }));
});

/* ============ SETUP ROUTE ============ */
router.get('/setup', async (req, env) => {
  const admin = await env.DB.prepare(`SELECT id FROM users WHERE role='admin' LIMIT 1`).first();
  if (admin) return redirect('/admin/login');
  return html(renderSetup({}));
});

/* ============ WORKER ENTRY ============ */
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const method = request.method.toUpperCase();
    const path = url.pathname;

    // API CORS-lite (same-origin expected)
    if (method === 'OPTIONS' && path.startsWith('/api/')) {
      return new Response(null, { status: 204, headers: {
        'Access-Control-Allow-Origin': url.origin,
        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
        'Access-Control-Allow-Headers': 'content-type',
        'Access-Control-Allow-Credentials': 'true'
      }});
    }

    try {
      const found = router.find(method, path);
      if (found) {
        const res = await found.handler(request, env, found.params);
        // security headers
        const headers = new Headers(res.headers);
        headers.set('x-frame-options', 'SAMEORIGIN');
        headers.set('x-content-type-options', 'nosniff');
        headers.set('referrer-policy', 'strict-origin-when-cross-origin');
        headers.set('permissions-policy', 'geolocation=(), microphone=()');
        return new Response(res.body, { status: res.status, headers });
      }

      // kick off auto-publish of scheduled content (best effort)
      if (ctx && ctx.waitUntil) ctx.waitUntil(newsApi.autoPublishScheduled(env).catch(() => {}));

      // 404
      if (path.startsWith('/api/')) {
        return fail('Endpoint not found', 404);
      }
      const settings = await loadSettingsMap(env);
      const nav = await env.DB.prepare(`SELECT * FROM navigation WHERE status='active' ORDER BY sort_order`).all();
      return html(renderError({ settings, navItems: nav.results, adsByPosition: {}, code: 404, message: 'Page Not Found' }), 404);
    } catch (err) {
      console.error('Worker error:', err && err.stack || err);
      if (path.startsWith('/api/')) {
        return fail('Something went wrong', 500);
      }
      try {
        const settings = await loadSettingsMap(env);
        return html(renderError({ settings, navItems: [], adsByPosition: {}, code: 500, message: 'Something went wrong' }), 500);
      } catch {
        return html('<h1>500</h1>', 500);
      }
    }
  }
};
