import { renderPublicLayout } from '../layout.js';
import { escapeHtml } from '../../utils/sanitize.js';
import { timeAgo } from './home.js';

export function renderCategory({ settings, navItems, adsByPosition, category, items, pagination, sidebarAds, popular }) {
  const cards = items.map(a => `
    <article class="card">
      <a href="/news/${escapeHtml(a.slug)}" class="card-img">
        <img src="${escapeHtml(a.featured_image || a.thumbnail || 'https://placehold.co/600x400/f3e8ff/8b5cf6?text=')}" alt="${escapeHtml(a.title)}" loading="lazy">
      </a>
      <div class="card-body">
        ${a.category_name ? `<span class="badge">${escapeHtml(a.category_name)}</span>` : ''}
        <h3><a href="/news/${escapeHtml(a.slug)}">${escapeHtml(a.title)}</a></h3>
        <p>${escapeHtml((a.excerpt||'').slice(0,110))}</p>
        <div class="card-meta"><span>${escapeHtml(a.author_name||'Staff')}</span><span>${timeAgo(a.published_at)}</span></div>
      </div>
    </article>
  `).join('');

  const pagerHtml = pagination.totalPages > 1 ? `
    <div class="pagination">
      ${pagination.page > 1 ? `<a href="?page=${pagination.page-1}">← Prev</a>` : ''}
      ${Array.from({length: Math.min(5, pagination.totalPages)}, (_,i) => {
        const p = i+1;
        return `<a href="?page=${p}" class="${p===pagination.page?'active':''}">${p}</a>`;
      }).join('')}
      ${pagination.page < pagination.totalPages ? `<a href="?page=${pagination.page+1}">Next →</a>` : ''}
    </div>` : '';

  const body = `
    <div class="container" style="padding-top:30px">
      <h1 style="font-size:32px;font-weight:800;margin-bottom:8px">${escapeHtml(category.name)}</h1>
      <p style="color:var(--muted);margin-bottom:24px">${escapeHtml(category.description || '')}</p>
      ${items.length ? `<div class="grid-3">${cards}</div>${pagerHtml}` : `<div class="empty"><h3>No articles yet</h3><p>Check back soon.</p></div>`}
    </div>`;

  return renderPublicLayout({
    settings, navItems, adsByPosition, body,
    title: category.meta_title || category.name,
    meta: { description: category.meta_description || category.description },
    path: `/category/${category.slug}`
  });
}
