import { text } from '../utils/response.js';

export async function robots(request, env) {
  const siteUrl = env.SITE_URL || new URL(request.url).origin;
  const body = `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api\n\nSitemap: ${siteUrl}/sitemap.xml\n`;
  return text(body);
}

export async function sitemap(request, env) {
  const siteUrl = env.SITE_URL || new URL(request.url).origin;
  const [news, cats, pages] = await Promise.all([
    env.DB.prepare(`SELECT slug, updated_at, published_at FROM news WHERE status='published' AND visibility='public' ORDER BY published_at DESC LIMIT 5000`).all(),
    env.DB.prepare(`SELECT slug, updated_at FROM categories WHERE status='active'`).all(),
    env.DB.prepare(`SELECT slug, updated_at FROM pages WHERE status='published'`).all()
  ]);
  const urls = [];
  urls.push(`<url><loc>${siteUrl}/</loc><changefreq>hourly</changefreq><priority>1.0</priority></url>`);
  for (const c of cats.results) urls.push(`<url><loc>${siteUrl}/category/${c.slug}</loc><changefreq>daily</changefreq><priority>0.7</priority></url>`);
  for (const p of pages.results) urls.push(`<url><loc>${siteUrl}/page/${p.slug}</loc><changefreq>weekly</changefreq><priority>0.5</priority></url>`);
  for (const n of news.results) {
    const last = (n.updated_at || n.published_at || '').slice(0, 10);
    urls.push(`<url><loc>${siteUrl}/news/${n.slug}</loc><lastmod>${last}</lastmod><changefreq>daily</changefreq><priority>0.8</priority></url>`);
  }
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>`;
  return text(xml, 'application/xml; charset=utf-8');
}
