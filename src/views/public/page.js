import { renderPublicLayout } from '../layout.js';
import { escapeHtml } from '../../utils/sanitize.js';

export function renderStaticPage({ settings, navItems, adsByPosition, page }) {
  const body = `
    <div class="container" style="padding:36px 0;max-width:860px">
      <article>
        <h1 style="font-size:32px;font-weight:800;margin-bottom:18px">${escapeHtml(page.title)}</h1>
        <div class="article-content">${page.content || ''}</div>
      </article>
    </div>`;
  return renderPublicLayout({
    settings, navItems, adsByPosition, body,
    title: page.meta_title || page.title,
    meta: { description: page.meta_description },
    path: `/page/${page.slug}`
  });
}

export function renderError({ settings, navItems, adsByPosition, code, message }) {
  const is404 = code === 404;
  const body = `
    <div class="container" style="padding:80px 0;text-align:center;max-width:640px">
      <div style="font-size:110px;font-weight:900;color:var(--primary);line-height:1">${code}</div>
      <h1 style="font-size:28px;font-weight:800;margin:12px 0">${escapeHtml(message || (is404 ? 'Page Not Found' : 'Something went wrong'))}</h1>
      <p style="color:var(--muted);margin-bottom:26px">${is404 ? 'Oops! The page you are looking for does not exist.' : 'An unexpected error occurred. Please try again.'}</p>
      <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
        <a href="/" class="btn btn-primary">Go Home</a>
        <a href="/search" class="btn btn-outline">Search News</a>
      </div>
    </div>`;
  return renderPublicLayout({ settings, navItems, adsByPosition, body, title: String(code), path: '/' });
}
