import { renderPublicLayout } from '../layout.js';
import { escapeHtml } from '../../utils/sanitize.js';
import { timeAgo } from './home.js';

export function renderSearch({ settings, navItems, adsByPosition, query, items, pagination, categories, activeCategory }) {
  const cats = categories.map(c => `
    <a href="/search?q=${encodeURIComponent(query)}&category=${c.slug}" class="filter-pill ${activeCategory===c.slug?'active':''}">${escapeHtml(c.name)}</a>
  `).join('');

  const results = items.map(a => `
    <article class="card">
      <a href="/news/${escapeHtml(a.slug)}" class="card-img">
        <img src="${escapeHtml(a.featured_image || a.thumbnail || 'https://placehold.co/600x400/f3e8ff/8b5cf6?text=')}" alt="${escapeHtml(a.title)}" loading="lazy">
      </a>
      <div class="card-body">
        ${a.category_name ? `<span class="badge">${escapeHtml(a.category_name)}</span>` : ''}
        <h3><a href="/news/${escapeHtml(a.slug)}">${escapeHtml(a.title)}</a></h3>
        <p>${escapeHtml((a.excerpt||'').slice(0,120))}</p>
        <div class="card-meta"><span>${timeAgo(a.published_at)}</span><span>${a.views} views</span></div>
      </div>
    </article>
  `).join('');

  const pager = pagination.totalPages > 1 ? `
    <div class="pagination">
      ${Array.from({length: Math.min(6, pagination.totalPages)}, (_,i) => {
        const p = i+1;
        return `<a href="?q=${encodeURIComponent(query)}&category=${activeCategory||''}&page=${p}" class="${p===pagination.page?'active':''}">${p}</a>`;
      }).join('')}
    </div>` : '';

  const body = `
    <div class="search-header">
      <div class="container">
        <form class="search-input-wrap" method="GET" action="/search">
          <input class="search-input" name="q" value="${escapeHtml(query)}" placeholder="Search news..." autofocus>
          <button class="btn btn-primary" type="submit">Search</button>
        </form>
      </div>
    </div>
    <div class="container" style="padding-top:22px">
      ${query ? `<p style="color:var(--muted);margin-bottom:8px">${pagination.total} result(s) for "<strong>${escapeHtml(query)}</strong>"</p>` : `<p style="color:var(--muted);margin-bottom:8px">Browse all news</p>`}
      <div class="filters">
        <a href="/search?q=${encodeURIComponent(query)}" class="filter-pill ${!activeCategory?'active':''}">All</a>
        ${cats}
      </div>
      ${items.length ? `<div class="grid-3">${results}</div>${pager}` : `<div class="empty">
        <h3>No results found for your search</h3>
        <p>Try different keywords or browse categories.</p>
        <a href="/" class="btn btn-primary" style="margin-top:16px">Back to Home</a>
      </div>`}
    </div>`;

  return renderPublicLayout({
    settings, navItems, adsByPosition, body,
    title: query ? `Search: ${query}` : 'Search News',
    meta: { description: 'Search our news archive.' },
    path: '/search'
  });
}
