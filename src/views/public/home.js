import { renderPublicLayout } from '../layout.js';
import { escapeHtml } from '../../utils/sanitize.js';

function timeAgo(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr.replace(' ', 'T') + 'Z').getTime();
  const diff = Math.max(1, Math.floor((Date.now() - d) / 60000));
  if (diff < 60) return `${diff}m ago`;
  if (diff < 1440) return `${Math.floor(diff/60)}h ago`;
  if (diff < 43200) return `${Math.floor(diff/1440)}d ago`;
  return new Date(d).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' });
}
export { timeAgo };

function cardHtml(a) {
  return `<article class="card">
    <a href="/news/${escapeHtml(a.slug)}" class="card-img">
      <img src="${escapeHtml(a.featured_image || a.thumbnail || 'https://placehold.co/600x400/f3e8ff/8b5cf6?text=News')}" alt="${escapeHtml(a.title)}" loading="lazy">
    </a>
    <div class="card-body">
      ${a.category_name ? `<span class="badge">${escapeHtml(a.category_name)}</span>` : ''}
      <h3><a href="/news/${escapeHtml(a.slug)}">${escapeHtml(a.title)}</a></h3>
      <p>${escapeHtml((a.excerpt || '').slice(0, 120))}</p>
      <div class="card-meta">
        <span>${escapeHtml(a.author_name || 'Staff')}</span>
        <span>${timeAgo(a.published_at || a.created_at)} · ${a.views || 0} views</span>
      </div>
    </div>
  </article>`;
}

export function renderHome({ settings, navItems, adsByPosition, data }) {
  const s = settings;
  const { hero, sideHero, latest, trending, featured, categories, popular, sidebarAds, headerAds, middleAds } = data;

  let body = '';

  // Header ad
  if (headerAds && headerAds.length) {
    body += `<div class="container">${renderAds(headerAds)}</div>`;
  }

  // Hero
  if (s.show_hero === '1' && hero) {
    body += `<section class="container hero">
      <div class="hero-grid">
        <a class="hero-main" href="/news/${escapeHtml(hero.slug)}">
          <img src="${escapeHtml(hero.featured_image || 'https://placehold.co/1200x750/8b5cf6/ffffff?text=Lead+Story')}" alt="${escapeHtml(hero.title)}">
          <div class="hero-overlay">
            ${hero.category_name ? `<span class="badge" style="background:rgba(255,255,255,.2);color:#fff">${escapeHtml(hero.category_name)}</span>` : ''}
            <h1>${escapeHtml(hero.title)}</h1>
            <p>${escapeHtml((hero.excerpt || '').slice(0,160))}</p>
            <div class="hero-meta">
              <span>By ${escapeHtml(hero.author_name || 'Staff')}</span>
              <span>·</span>
              <span>${timeAgo(hero.published_at || hero.created_at)}</span>
            </div>
          </div>
        </a>
        <div class="hero-side">
          ${(sideHero||[]).slice(0,4).map(a => `
            <a class="side-card" href="/news/${escapeHtml(a.slug)}">
              <img src="${escapeHtml(a.thumbnail || a.featured_image || 'https://placehold.co/200x200/f3e8ff/8b5cf6?text=')}" alt="${escapeHtml(a.title)}" loading="lazy">
              <div class="side-card-body">
                ${a.category_name ? `<span class="badge" style="font-size:10px">${escapeHtml(a.category_name)}</span>` : ''}
                <h3>${escapeHtml(a.title)}</h3>
                <div class="meta">${timeAgo(a.published_at || a.created_at)}</div>
              </div>
            </a>
          `).join('')}
        </div>
      </div>
    </section>`;
  }

  // Middle ads
  if (middleAds && middleAds.length) body += `<div class="container">${renderAds(middleAds)}</div>`;

  // Main layout with sidebar
  const sidebarOn = s.show_sidebar === '1';
  body += `<div class="container" style="display:grid;grid-template-columns:${sidebarOn ? 'minmax(0,1fr) 320px' : '1fr'};gap:34px;padding-top:20px" class="home-columns">`;

  // Main column
  body += `<div>`;

  // Latest
  if (s.show_latest === '1' && latest.length) {
    body += `<section class="section">
      <div class="section-head">
        <h2 class="section-title">Latest News<small>Fresh from our newsroom</small></h2>
        <a href="/search" class="section-link">View all →</a>
      </div>
      <div class="grid-2">${latest.slice(0,6).map(cardHtml).join('')}</div>
    </section>`;
  }

  // Featured
  if (s.show_featured === '1' && featured.length) {
    body += `<section class="section">
      <div class="section-head">
        <h2 class="section-title">Featured<small>Handpicked stories</small></h2>
      </div>
      <div class="grid-3">${featured.slice(0,3).map(cardHtml).join('')}</div>
    </section>`;
  }

  // Newsletter
  if (s.show_newsletter === '1' && s.newsletter_enabled === '1') {
    body += `<section class="section">
      <div class="newsletter-box">
        <h3>Stay in the loop</h3>
        <p>Get the latest headlines delivered straight to your inbox.</p>
        <form class="newsletter-form" id="newsletterForm" autocomplete="off">
          <input type="email" name="email" placeholder="you@example.com" required>
          <button type="submit">Subscribe</button>
        </form>
      </div>
    </section>`;
  }

  // Category sections
  for (const c of (categories || []).slice(0, 2)) {
    if (!c.items || !c.items.length) continue;
    body += `<section class="section">
      <div class="section-head">
        <h2 class="section-title">${escapeHtml(c.name)}<small>${escapeHtml(c.description || '')}</small></h2>
        <a href="/category/${escapeHtml(c.slug)}" class="section-link">View all →</a>
      </div>
      <div class="grid-3">${c.items.slice(0,3).map(cardHtml).join('')}</div>
    </section>`;
  }

  body += `</div>`; // main column

  // Sidebar
  if (sidebarOn) {
    body += `<aside class="sidebar">
      ${sidebarAds && sidebarAds.length ? `<div class="side-block"><h4>Sponsored</h4>${renderAds(sidebarAds)}</div>` : ''}
      <div class="side-block">
        <h4>Trending Now</h4>
        <div class="pop-list">
          ${trending.slice(0,5).map(a => `
            <a class="pop-item" href="/news/${escapeHtml(a.slug)}">
              <img src="${escapeHtml(a.thumbnail || a.featured_image || 'https://placehold.co/128x128/f3e8ff/8b5cf6?text=')}" alt="" loading="lazy">
              <div>
                <div class="t">${escapeHtml(a.title)}</div>
                <div class="v">${a.views || 0} views</div>
              </div>
            </a>
          `).join('')}
        </div>
      </div>
      <div class="side-block">
        <h4>Popular</h4>
        <div class="pop-list">
          ${popular.slice(0,5).map(a => `
            <a class="pop-item" href="/news/${escapeHtml(a.slug)}">
              <img src="${escapeHtml(a.thumbnail || a.featured_image || 'https://placehold.co/128x128/f3e8ff/8b5cf6?text=')}" alt="" loading="lazy">
              <div>
                <div class="t">${escapeHtml(a.title)}</div>
                <div class="v">${a.views || 0} views</div>
              </div>
            </a>
          `).join('')}
        </div>
      </div>
    </aside>`;
  }

  body += `</div>`;

  return renderPublicLayout({
    settings, navItems, adsByPosition,
    body,
    title: null,
    meta: {
      description: s.seo_description,
      keywords: s.seo_keywords,
      ogTitle: s.og_title || s.site_name,
      ogDescription: s.og_description,
      image: s.og_image
    },
    path: '/'
  });
}

export function renderAds(ads) {
  return ads.map(ad => {
    if (ad.code) return `<div class="ad-slot">${ad.code}</div>`;
    if (ad.image_url) return `<div class="ad-slot"><a href="${escapeHtml(ad.target_url||'#')}" target="_blank" rel="noopener"><img src="${escapeHtml(ad.image_url)}" alt="${escapeHtml(ad.name||'Advertisement')}"></a></div>`;
    return '';
  }).join('');
}
