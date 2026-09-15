import { renderPublicLayout } from '../layout.js';
import { escapeHtml } from '../../utils/sanitize.js';
import { timeAgo, renderAds } from './home.js';

function readingTime(content) {
  const words = String(content || '').replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export function renderArticle({ settings, navItems, adsByPosition, article, related, popular, comments, ads, jsonLd }) {
  const s = settings;
  const canonical = article.canonical_url || `${s.canonical_url || ''}/news/${article.slug}`;

  const relatedHtml = (related || []).length ? `
    <section class="section">
      <h2 class="section-title" style="margin-bottom:20px">Related Articles</h2>
      <div class="grid-3">
        ${related.map(r => `
          <article class="card">
            <a href="/news/${escapeHtml(r.slug)}" class="card-img">
              <img src="${escapeHtml(r.thumbnail || r.featured_image || 'https://placehold.co/600x400/f3e8ff/8b5cf6?text=')}" alt="${escapeHtml(r.title)}" loading="lazy">
            </a>
            <div class="card-body">
              ${r.category_name ? `<span class="badge">${escapeHtml(r.category_name)}</span>` : ''}
              <h3><a href="/news/${escapeHtml(r.slug)}">${escapeHtml(r.title)}</a></h3>
              <div class="card-meta"><span>${timeAgo(r.published_at)}</span></div>
            </div>
          </article>
        `).join('')}
      </div>
    </section>` : '';

  const commentsHtml = s.comments_enabled === '1' ? `
    <section class="section">
      <h2 class="section-title" style="margin-bottom:20px">Comments (${(comments||[]).length})</h2>
      <div style="background:#fff;border-radius:18px;padding:22px;box-shadow:var(--shadow-sm);margin-bottom:20px">
        ${(comments||[]).length ? comments.map(c => `
          <div style="padding:14px 0;border-bottom:1px solid var(--border)">
            <div style="font-weight:700;font-size:14px;margin-bottom:4px">${escapeHtml(c.name)} <span style="color:var(--muted);font-weight:400;font-size:12px">· ${timeAgo(c.created_at)}</span></div>
            <div style="font-size:14px;color:#3f3f46">${escapeHtml(c.content)}</div>
          </div>
        `).join('') : `<div class="empty" style="padding:30px"><h3>No comments yet</h3><p>Be the first to share your thoughts.</p></div>`}
      </div>
      <form id="commentForm" data-news-id="${article.id}" style="background:#fff;border-radius:18px;padding:22px;box-shadow:var(--shadow-sm)">
        <h3 style="margin-bottom:14px;font-size:15px">Leave a comment</h3>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px">
          <input required name="name" placeholder="Your name" style="padding:11px 14px;border-radius:11px;border:1px solid var(--border)">
          <input required type="email" name="email" placeholder="Email" style="padding:11px 14px;border-radius:11px;border:1px solid var(--border)">
        </div>
        <textarea required name="content" rows="4" placeholder="Write a comment..." style="width:100%;padding:11px 14px;border-radius:11px;border:1px solid var(--border);resize:vertical"></textarea>
        <div style="margin-top:12px"><button class="btn btn-primary" type="submit">Post Comment</button></div>
      </form>
    </section>` : '';

  const body = `
    <div class="container">
      <div class="article-wrap">
        <article>
          <div class="breadcrumb"><a href="/">Home</a> / ${article.category_name ? `<a href="/category/${escapeHtml(article.category_slug)}">${escapeHtml(article.category_name)}</a> / ` : ''} <span>${escapeHtml(article.title.slice(0,50))}</span></div>
          <header class="article-header">
            ${article.category_name ? `<span class="badge">${escapeHtml(article.category_name)}</span>` : ''}
            <h1>${escapeHtml(article.title)}</h1>
            ${article.excerpt ? `<p style="color:var(--muted);font-size:17px;margin-bottom:16px">${escapeHtml(article.excerpt)}</p>` : ''}
            <div class="article-meta">
              <span>By <strong>${escapeHtml(article.author_name || 'Staff')}</strong></span>
              <span>·</span>
              <span>${article.published_at ? new Date(article.published_at).toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'}) : timeAgo(article.created_at)}</span>
              <span>·</span>
              <span>${readingTime(article.content)} min read</span>
              <span>·</span>
              <span>${article.views || 0} views</span>
            </div>
          </header>
          ${article.featured_image ? `<div class="article-hero-img"><img src="${escapeHtml(article.featured_image)}" alt="${escapeHtml(article.title)}"></div>` : ''}
          ${ads?.top?.length ? renderAds(ads.top) : ''}
          <div class="article-content">${article.content || ''}</div>
          ${ads?.middle?.length ? renderAds(ads.middle) : ''}
          <div class="share-row">
            <strong>Share:</strong>
            <a class="share-btn" data-share="facebook" href="#" aria-label="Facebook">f</a>
            <a class="share-btn" data-share="twitter" href="#" aria-label="Twitter">X</a>
            <a class="share-btn" data-share="linkedin" href="#" aria-label="LinkedIn">in</a>
            <a class="share-btn" data-share="whatsapp" href="#" aria-label="WhatsApp">wa</a>
            <a class="share-btn" data-share="telegram" href="#" aria-label="Telegram">tg</a>
            <a class="share-btn" data-copy href="#" aria-label="Copy link" title="Copy link">🔗</a>
          </div>
          ${ads?.bottom?.length ? renderAds(ads.bottom) : ''}
          ${relatedHtml}
          ${commentsHtml}
        </article>
        <aside class="sidebar">
          ${ads?.sidebar?.length ? `<div class="side-block"><h4>Sponsored</h4>${renderAds(ads.sidebar)}</div>` : ''}
          <div class="side-block">
            <h4>Popular Stories</h4>
            <div class="pop-list">
              ${(popular||[]).map(a => `
                <a class="pop-item" href="/news/${escapeHtml(a.slug)}">
                  <img src="${escapeHtml(a.thumbnail || a.featured_image || 'https://placehold.co/128x128/f3e8ff/8b5cf6?text=')}" alt="" loading="lazy">
                  <div><div class="t">${escapeHtml(a.title)}</div><div class="v">${a.views} views</div></div>
                </a>
              `).join('')}
            </div>
          </div>
        </aside>
      </div>
    </div>`;

  return renderPublicLayout({
    settings, navItems, adsByPosition,
    body,
    title: article.meta_title || article.title,
    meta: {
      description: article.meta_description || article.excerpt,
      keywords: article.meta_keywords,
      canonical,
      image: article.featured_image,
      ogTitle: article.meta_title || article.title,
      ogDescription: article.meta_description || article.excerpt,
      type: 'article',
      jsonLd: JSON.stringify(jsonLd)
    },
    path: `/news/${article.slug}`
  });
}
