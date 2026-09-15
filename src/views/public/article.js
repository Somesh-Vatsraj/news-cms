import { renderPublicLayout } from '../layout.js';
import { escapeHtml } from '../../utils/sanitize.js';
import { timeAgo, renderAds } from './home.js';

function readingTime(content) {
  const words = String(content || '').replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export function renderArticle({ settings, navItems, adsByPosition, article, related, popular, categories, comments, ads, jsonLd }) {
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
      <div class="comments-list-box">
        ${(comments||[]).length ? comments.map(c => `
          <div class="comment-item">
            <div class="comment-author">${escapeHtml(c.name)} <span class="comment-time">· ${timeAgo(c.created_at)}</span></div>
            <div class="comment-body">${escapeHtml(c.content)}</div>
          </div>
        `).join('') : `<div class="empty" style="padding:30px"><h3>No comments yet</h3><p>Be the first to share your thoughts.</p></div>`}
      </div>
      <form id="commentForm" data-news-id="${article.id}" class="comment-form-box">
        <h3>Leave a comment</h3>
        <div class="form-row-2">
          <input required name="name" placeholder="Your name">
          <input required type="email" name="email" placeholder="Email">
        </div>
        <textarea required name="content" rows="4" placeholder="Write a comment..."></textarea>
        <div class="form-actions"><button class="btn btn-primary" type="submit">Post Comment</button></div>
      </form>
    </section>` : '';

  // Category list for sidebar (below popular stories)
  const sidebarCategories = (categories || []).map(c => `
    <a class="cat-item" href="/category/${escapeHtml(c.slug)}">
      <span class="cat-dot"></span>
      <span class="cat-name">${escapeHtml(c.name)}</span>
      <span class="cat-arrow">→</span>
    </a>
  `).join('');

  const body = `
    <div class="container">
      <div class="article-wrap">
        <article>
          <div class="breadcrumb">
            <a href="/">Home</a> /
            ${article.category_name ? `<a href="/category/${escapeHtml(article.category_slug)}">${escapeHtml(article.category_name)}</a> / ` : ''}
            <span>${escapeHtml(article.title.slice(0, 50))}</span>
          </div>

          <!-- ⬇️ WHITE CARD WRAPPER — yahan sab text white bg par aayega -->
          <div class="article-card">
            <header class="article-header">
              ${article.category_name ? `<span class="badge">${escapeHtml(article.category_name)}</span>` : ''}
              <h1>${escapeHtml(article.title)}</h1>
              ${article.excerpt ? `<p class="article-excerpt">${escapeHtml(article.excerpt)}</p>` : ''}
              <div class="article-meta">
                <span>By <strong>${escapeHtml(article.author_name || 'Staff')}</strong></span>
                <span>·</span>
                <span>${article.published_at ? new Date(article.published_at).toLocaleDateString('en-US', { month:'long', day:'numeric', year:'numeric' }) : timeAgo(article.created_at)}</span>
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
          </div>
          <!-- ⬆️ WHITE CARD END -->

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
                  <div>
                    <div class="t">${escapeHtml(a.title)}</div>
                    <div class="v">${a.views} views</div>
                  </div>
                </a>
              `).join('')}
            </div>
          </div>

          <!-- ⬇️ CATEGORIES — Popular Stories ke NICHE -->
          ${sidebarCategories ? `
          <div class="side-block">
            <h4>Categories</h4>
            <div class="cat-list">${sidebarCategories}</div>
          </div>` : ''}
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
