export const PUBLIC_CSS = `
:root{
  --primary:#8b5cf6;--primary-dark:#7c3aed;--secondary:#a855f7;
  --light-purple:#f3e8ff;--background:#faf5ff;--white:#ffffff;
  --text:#18181b;--muted:#71717a;--border:#e4e4e7;
  --success:#22c55e;--danger:#ef4444;--warning:#f59e0b;
  --radius:18px;--shadow:0 8px 30px rgba(0,0,0,.06);
  --shadow-sm:0 2px 10px rgba(0,0,0,.04);
  --shadow-lg:0 20px 50px rgba(139,92,246,.15);
  --ease:cubic-bezier(.4,0,.2,1);
  --ease-out:cubic-bezier(0,0,.2,1);
}
*{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
html,body{overflow-x:hidden}
body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
  background:var(--background);color:var(--text);line-height:1.55;font-size:16px;-webkit-font-smoothing:antialiased;
  animation:pageFade .5s var(--ease-out)}
@keyframes pageFade{from{opacity:0}to{opacity:1}}
a{color:inherit;text-decoration:none;transition:color .2s var(--ease)}
img{max-width:100%;display:block;height:auto}
button,input,textarea,select{font-family:inherit;font-size:inherit}
.container{max-width:1240px;margin:0 auto;padding:0 18px}
::selection{background:var(--primary);color:#fff}
/* Scrollbar */
::-webkit-scrollbar{width:10px;height:10px}
::-webkit-scrollbar-track{background:var(--background)}
::-webkit-scrollbar-thumb{background:linear-gradient(180deg,var(--primary),var(--secondary));border-radius:5px;border:2px solid var(--background)}
::-webkit-scrollbar-thumb:hover{background:var(--primary-dark)}

/* ============ HEADER ============ */
.site-header{position:sticky;top:0;z-index:100;background:rgba(255,255,255,.92);backdrop-filter:saturate(180%) blur(14px);-webkit-backdrop-filter:saturate(180%) blur(14px);border-bottom:1px solid var(--border);transition:box-shadow .3s var(--ease)}
.site-header:hover{box-shadow:0 4px 20px rgba(0,0,0,.04)}
.header-inner{display:flex;align-items:center;justify-content:space-between;gap:18px;padding:14px 0}
.logo{display:flex;align-items:center;gap:10px;font-weight:800;font-size:22px;color:var(--primary-dark);transition:transform .3s var(--ease)}
.logo:hover{transform:scale(1.03)}
.logo-mark{width:36px;height:36px;background:linear-gradient(135deg,var(--primary),var(--secondary));border-radius:11px;display:grid;place-items:center;color:#fff;font-size:18px;font-weight:900;box-shadow:0 4px 12px rgba(139,92,246,.35);transition:all .3s var(--ease)}
.logo:hover .logo-mark{transform:rotate(-8deg) scale(1.08);box-shadow:0 6px 20px rgba(139,92,246,.5)}
.nav{display:flex;gap:4px;align-items:center}
.nav a{padding:8px 14px;border-radius:10px;font-size:15px;font-weight:500;color:var(--text);transition:all .25s var(--ease);position:relative;overflow:hidden}
.nav a::after{content:"";position:absolute;bottom:4px;left:50%;width:0;height:2px;background:linear-gradient(90deg,var(--primary),var(--secondary));border-radius:2px;transition:all .3s var(--ease);transform:translateX(-50%)}
.nav a:hover{background:var(--light-purple);color:var(--primary-dark);transform:translateY(-1px)}
.nav a:hover::after{width:60%}
.header-actions{display:flex;align-items:center;gap:8px}
.icon-btn{width:40px;height:40px;border-radius:11px;background:transparent;border:1px solid var(--border);cursor:pointer;display:grid;place-items:center;color:var(--text);transition:all .25s var(--ease)}
.icon-btn:hover{background:var(--light-purple);border-color:var(--primary);color:var(--primary-dark);transform:translateY(-2px) rotate(5deg);box-shadow:0 4px 12px rgba(139,92,246,.2)}
.icon-btn:active{transform:translateY(0) scale(.95)}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:10px 18px;border-radius:11px;font-weight:600;font-size:14px;cursor:pointer;border:1px solid transparent;transition:all .25s var(--ease);white-space:nowrap;position:relative;overflow:hidden}
.btn::before{content:"";position:absolute;inset:0;background:linear-gradient(120deg,transparent 30%,rgba(255,255,255,.3),transparent 70%);transform:translateX(-100%);transition:transform .6s var(--ease)}
.btn:hover::before{transform:translateX(100%)}
.btn-primary{background:var(--primary);color:#fff;box-shadow:0 4px 14px rgba(139,92,246,.3)}
.btn-primary:hover{background:var(--primary-dark);transform:translateY(-2px);box-shadow:0 8px 22px rgba(139,92,246,.4)}
.btn-primary:active{transform:translateY(0) scale(.98)}
.btn-outline{background:transparent;border-color:var(--border);color:var(--text)}
.btn-outline:hover{border-color:var(--primary);color:var(--primary-dark);background:var(--light-purple);transform:translateY(-2px)}
.btn-ghost{background:transparent;color:var(--muted)}
.btn-ghost:hover{color:var(--primary-dark);background:var(--light-purple)}
.btn-sm{padding:6px 12px;font-size:13px}
.mobile-toggle{display:none}

/* ============ BREAKING BAR ============ */
.breaking-bar{background:linear-gradient(90deg,#7c3aed,#a855f7,#7c3aed);background-size:200% auto;color:#fff;overflow:hidden;font-size:14px;animation:bgShift 6s linear infinite}
@keyframes bgShift{0%{background-position:0% center}100%{background-position:200% center}}
.breaking-inner{display:flex;align-items:center;gap:14px;padding:9px 0}
.breaking-label{background:rgba(0,0,0,.25);padding:4px 11px;border-radius:8px;font-weight:800;letter-spacing:.5px;font-size:11px;animation:pulseLabel 1.6s ease-in-out infinite}
@keyframes pulseLabel{0%,100%{box-shadow:0 0 0 0 rgba(255,255,255,.4)}50%{box-shadow:0 0 0 6px rgba(255,255,255,0)}}
.breaking-scroll{overflow:hidden;flex:1;position:relative;height:22px}
.breaking-track{display:flex;gap:40px;animation:slide 40s linear infinite;white-space:nowrap;position:absolute}
@keyframes slide{from{transform:translateX(0)}to{transform:translateX(-50%)}}
.breaking-track:hover{animation-play-state:paused}
.breaking-track a{color:#fff;opacity:.95;transition:opacity .2s}
.breaking-track a:hover{opacity:1;text-decoration:underline}

/* ============ HERO ============ */
.hero{padding:30px 0 10px;animation:fadeUp .6s var(--ease-out) both}
.hero-grid{display:grid;grid-template-columns:2fr 1fr;gap:24px}
.hero-main{position:relative;border-radius:var(--radius);overflow:hidden;aspect-ratio:16/10;background:#111;box-shadow:var(--shadow);transition:transform .5s var(--ease),box-shadow .5s var(--ease)}
.hero-main:hover{transform:translateY(-4px);box-shadow:var(--shadow-lg)}
.hero-main img{width:100%;height:100%;object-fit:cover;transition:transform 1.2s var(--ease)}
.hero-main:hover img{transform:scale(1.06)}
.hero-overlay{position:absolute;inset:0;background:linear-gradient(180deg,transparent 20%,rgba(0,0,0,.35) 55%,rgba(0,0,0,.9));color:#fff;padding:26px;display:flex;flex-direction:column;justify-content:flex-end}
.hero-overlay h1{font-size:clamp(22px,3.2vw,38px);line-height:1.15;margin:10px 0 8px;font-weight:800;transition:transform .3s var(--ease)}
.hero-main:hover .hero-overlay h1{transform:translateY(-2px)}
.hero-overlay p{opacity:.92;font-size:15px;max-width:640px}
.hero-meta{display:flex;align-items:center;gap:14px;font-size:13px;opacity:.9;margin-top:12px}
.hero-side{display:flex;flex-direction:column;gap:14px}
.side-card{display:grid;grid-template-columns:110px 1fr;gap:12px;background:#fff;border-radius:14px;overflow:hidden;box-shadow:var(--shadow-sm);transition:all .35s var(--ease);animation:fadeUp .5s var(--ease-out) both}
.side-card:nth-child(1){animation-delay:.05s}
.side-card:nth-child(2){animation-delay:.1s}
.side-card:nth-child(3){animation-delay:.15s}
.side-card:nth-child(4){animation-delay:.2s}
.side-card:hover{transform:translateY(-4px) scale(1.01);box-shadow:var(--shadow-lg)}
.side-card img{width:110px;height:100%;object-fit:cover;aspect-ratio:1;transition:transform .6s var(--ease)}
.side-card:hover img{transform:scale(1.1)}
.side-card-body{padding:10px 12px 10px 0;display:flex;flex-direction:column;gap:4px}
.side-card-body h3{font-size:14px;line-height:1.3;font-weight:700;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;transition:color .2s}
.side-card:hover .side-card-body h3{color:var(--primary-dark)}
.side-card-body .meta{font-size:11px;color:var(--muted);margin-top:auto;display:flex;gap:8px}

/* ============ BADGES ============ */
.badge{display:inline-block;padding:3px 9px;border-radius:7px;font-size:11px;font-weight:700;letter-spacing:.3px;background:var(--light-purple);color:var(--primary-dark);text-transform:uppercase;transition:all .25s var(--ease)}
.card:hover .badge{background:var(--primary);color:#fff;transform:translateY(-2px)}
.badge.breaking{background:#fee2e2;color:#b91c1c;animation:pulseBadge 1.5s ease-in-out infinite}
@keyframes pulseBadge{0%,100%{box-shadow:0 0 0 0 rgba(239,68,68,.4)}50%{box-shadow:0 0 0 5px rgba(239,68,68,0)}}

/* ============ SECTION ============ */
.section{padding:34px 0;animation:fadeUp .5s var(--ease-out) both}
.section-head{display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:20px;gap:16px;flex-wrap:wrap}
.section-title{font-size:22px;font-weight:800;position:relative;padding-left:14px}
.section-title::before{content:"";position:absolute;left:0;top:6px;bottom:6px;width:4px;border-radius:3px;background:linear-gradient(180deg,var(--primary),var(--secondary));animation:barGrow .6s var(--ease-out)}
@keyframes barGrow{from{height:0;top:50%}to{height:auto;top:6px}}
.section-title small{display:block;font-weight:500;color:var(--muted);font-size:13px;margin-top:2px}
.section-link{font-size:13px;font-weight:600;color:var(--primary-dark);position:relative;transition:transform .25s var(--ease)}
.section-link::after{content:"";position:absolute;left:0;right:0;bottom:-2px;height:1px;background:currentColor;transform:scaleX(0);transform-origin:right;transition:transform .3s var(--ease)}
.section-link:hover{transform:translateX(4px)}
.section-link:hover::after{transform:scaleX(1);transform-origin:left}

/* ============ GRID ============ */
.grid-4{display:grid;grid-template-columns:repeat(4,1fr);gap:22px}
.grid-3{display:grid;grid-template-columns:repeat(3,1fr);gap:22px}
.grid-2{display:grid;grid-template-columns:repeat(2,1fr);gap:22px}

/* ============ CARD ============ */
.card{background:#fff;border-radius:var(--radius);overflow:hidden;box-shadow:var(--shadow-sm);transition:all .4s var(--ease);display:flex;flex-direction:column;animation:fadeUp .5s var(--ease-out) both;position:relative}
.card::before{content:"";position:absolute;inset:0;border-radius:var(--radius);padding:1px;background:linear-gradient(135deg,transparent 60%,rgba(139,92,246,.4));-webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);-webkit-mask-composite:xor;mask-composite:exclude;opacity:0;transition:opacity .4s var(--ease);pointer-events:none}
.card:hover{transform:translateY(-6px);box-shadow:var(--shadow-lg)}
.card:hover::before{opacity:1}
.card-img{aspect-ratio:16/10;overflow:hidden;background:#f4f4f5;position:relative}
.card-img::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,transparent 60%,rgba(0,0,0,.25));opacity:0;transition:opacity .4s var(--ease)}
.card:hover .card-img::after{opacity:1}
.card-img img{width:100%;height:100%;object-fit:cover;transition:transform .8s var(--ease)}
.card:hover .card-img img{transform:scale(1.08)}
.card-body{padding:16px;display:flex;flex-direction:column;gap:8px;flex:1}
.card-body h3{font-size:16px;font-weight:700;line-height:1.35;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;transition:color .25s}
.card:hover .card-body h3{color:var(--primary-dark)}
.card-body p{font-size:14px;color:var(--muted);display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.card-meta{display:flex;align-items:center;justify-content:space-between;gap:8px;font-size:12px;color:var(--muted);margin-top:auto;padding-top:8px;border-top:1px solid var(--border)}

/* Stagger cards */
.grid-3 .card:nth-child(1),.grid-4 .card:nth-child(1),.grid-2 .card:nth-child(1){animation-delay:0s}
.grid-3 .card:nth-child(2),.grid-4 .card:nth-child(2),.grid-2 .card:nth-child(2){animation-delay:.08s}
.grid-3 .card:nth-child(3),.grid-4 .card:nth-child(3),.grid-2 .card:nth-child(3){animation-delay:.16s}
.grid-4 .card:nth-child(4){animation-delay:.24s}

/* ============ ARTICLE ============ */
.article-wrap{display:grid;grid-template-columns:minmax(0,1fr) 340px;gap:34px;padding:26px 0 40px}
.article-card{background:#fff;border-radius:var(--radius);box-shadow:var(--shadow);padding:30px 34px;margin:12px 0 26px;animation:fadeUp .6s var(--ease-out) both}
.article-header h1{font-size:clamp(24px,3.4vw,40px);line-height:1.18;font-weight:800;margin:10px 0 14px;letter-spacing:-.02em;background:linear-gradient(135deg,var(--text) 30%,var(--primary-dark));-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
.article-meta{display:flex;flex-wrap:wrap;gap:14px;color:var(--muted);font-size:13px;align-items:center;padding-bottom:16px;border-bottom:1px solid var(--border)}
.article-hero-img{margin:22px 0;border-radius:var(--radius);overflow:hidden;aspect-ratio:16/9;box-shadow:var(--shadow-sm)}
.article-hero-img img{width:100%;height:100%;object-fit:cover;transition:transform 1s var(--ease)}
.article-hero-img:hover img{transform:scale(1.03)}
.article-content{font-size:17px;line-height:1.8;color:#27272a}
.article-content p{margin:0 0 18px}
.article-content h2{font-size:24px;margin:28px 0 12px;font-weight:800;position:relative;padding-left:14px}
.article-content h2::before{content:"";position:absolute;left:0;top:8px;bottom:8px;width:4px;border-radius:3px;background:linear-gradient(180deg,var(--primary),var(--secondary))}
.article-content h3{font-size:20px;margin:22px 0 10px;font-weight:700}
.article-content ul,.article-content ol{margin:0 0 18px 22px}
.article-content li{margin-bottom:6px}
.article-content blockquote{border-left:4px solid var(--primary);padding:12px 18px;margin:18px 0;color:#52525b;font-style:italic;background:linear-gradient(90deg,var(--light-purple),transparent);border-radius:0 12px 12px 0;transition:transform .3s var(--ease)}
.article-content blockquote:hover{transform:translateX(4px)}
.article-content img{border-radius:14px;margin:14px 0;box-shadow:var(--shadow-sm);transition:transform .4s var(--ease),box-shadow .4s var(--ease)}
.article-content img:hover{transform:scale(1.02);box-shadow:var(--shadow)}
.article-content a{color:var(--primary-dark);text-decoration:underline;text-decoration-color:var(--light-purple);text-underline-offset:3px;transition:text-decoration-color .2s}
.article-content a:hover{text-decoration-color:var(--primary)}

/* ============ SHARE ============ */
.share-row{display:flex;gap:10px;flex-wrap:wrap;margin:26px 0;padding:18px;background:#fff;border-radius:14px;box-shadow:var(--shadow-sm);align-items:center}
.share-row strong{font-size:13px;color:var(--muted);margin-right:8px}
.share-btn{width:40px;height:40px;border-radius:11px;background:var(--light-purple);display:grid;place-items:center;color:var(--primary-dark);transition:all .3s var(--ease);font-weight:700}
.share-btn:hover{background:var(--primary);color:#fff;transform:translateY(-3px) rotate(-5deg);box-shadow:0 8px 20px rgba(139,92,246,.4)}
.share-btn:active{transform:translateY(0) scale(.9)}
.breadcrumb{font-size:13px;color:var(--muted);margin-bottom:6px;display:flex;gap:6px;align-items:center;flex-wrap:wrap}
.breadcrumb a{transition:color .2s;padding:2px 6px;border-radius:6px}
.breadcrumb a:hover{color:var(--primary-dark);background:var(--light-purple)}

/* ============ SIDEBAR ============ */
.sidebar{display:flex;flex-direction:column;gap:24px}
.side-block{background:#fff;border-radius:var(--radius);padding:20px;box-shadow:var(--shadow-sm);transition:box-shadow .3s var(--ease);animation:fadeUp .5s var(--ease-out) both}
.side-block:nth-child(1){animation-delay:.05s}
.side-block:nth-child(2){animation-delay:.1s}
.side-block:nth-child(3){animation-delay:.15s}
.side-block:hover{box-shadow:var(--shadow)}
.side-block h4{font-size:15px;font-weight:800;margin-bottom:14px;display:flex;align-items:center;gap:8px}
.side-block h4::before{content:"";width:4px;height:16px;border-radius:3px;background:linear-gradient(180deg,var(--primary),var(--secondary))}
.pop-list{display:flex;flex-direction:column;gap:12px}
.pop-item{display:grid;grid-template-columns:64px 1fr;gap:12px;align-items:start;padding:6px;margin:-6px;border-radius:10px;transition:background .2s var(--ease)}
.pop-item:hover{background:var(--light-purple)}
.pop-item img{width:64px;height:64px;border-radius:10px;object-fit:cover;background:#f4f4f5;transition:transform .4s var(--ease)}
.pop-item:hover img{transform:scale(1.08) rotate(-2deg)}
.pop-item .t{font-size:13px;font-weight:600;line-height:1.35;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;transition:color .2s}
.pop-item:hover .t{color:var(--primary-dark)}
.pop-item .v{font-size:11px;color:var(--muted);margin-top:4px}

/* Sidebar categories (from article.js) */
.cat-list{display:flex;flex-direction:column;gap:4px}
.cat-item{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:10px;transition:all .25s var(--ease);font-size:14px;font-weight:500;color:var(--text)}
.cat-item:hover{background:var(--light-purple);color:var(--primary-dark);transform:translateX(4px)}
.cat-dot{width:6px;height:6px;border-radius:50%;background:linear-gradient(135deg,var(--primary),var(--secondary));flex-shrink:0;transition:transform .25s var(--ease)}
.cat-item:hover .cat-dot{transform:scale(1.6)}
.cat-name{flex:1}
.cat-arrow{color:var(--muted);font-size:14px;transition:all .25s var(--ease)}
.cat-item:hover .cat-arrow{color:var(--primary-dark);transform:translateX(4px)}

/* ============ COMMENTS ============ */
.comments-list-box{background:#fff;border-radius:var(--radius);padding:22px 26px;box-shadow:var(--shadow-sm);margin-bottom:20px;animation:fadeUp .5s var(--ease-out) both}
.comment-item{padding:14px 0;border-bottom:1px solid var(--border);animation:fadeUp .3s var(--ease-out) both;transition:transform .2s var(--ease)}
.comment-item:hover{transform:translateX(3px)}
.comment-item:last-child{border-bottom:none}
.comment-author{font-weight:700;font-size:14px;margin-bottom:5px;color:var(--text)}
.comment-time{color:var(--muted);font-weight:400;font-size:12px}
.comment-body{font-size:14.5px;color:#3f3f46;line-height:1.6}
.comment-form-box{background:#fff;border-radius:var(--radius);padding:22px 26px;box-shadow:var(--shadow-sm);animation:fadeUp .6s var(--ease-out) both}
.comment-form-box h3{margin-bottom:14px;font-size:16px;font-weight:700}
.comment-form-box .form-row-2{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px}
.comment-form-box input,.comment-form-box textarea{width:100%;padding:12px 14px;border-radius:11px;border:1px solid var(--border);background:#fff;font-size:14.5px;outline:none;transition:all .25s var(--ease);resize:vertical;font-family:inherit}
.comment-form-box input:focus,.comment-form-box textarea:focus{border-color:var(--primary);box-shadow:0 0 0 4px rgba(139,92,246,.13);transform:translateY(-1px)}
.comment-form-box .form-actions{margin-top:12px}

/* ============ FOOTER ============ */
.site-footer{background:#18181b;color:#d4d4d8;margin-top:40px;padding:44px 0 18px;position:relative;overflow:hidden}
.site-footer::before{content:"";position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,var(--primary),var(--secondary),var(--primary));background-size:200% 100%;animation:bgShift 4s linear infinite}
.footer-grid{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:30px;margin-bottom:30px}
.footer-grid h4{color:#fff;font-size:14px;margin-bottom:14px;font-weight:700}
.footer-grid a{display:block;padding:4px 0;font-size:14px;color:#a1a1aa;transition:all .25s var(--ease)}
.footer-grid a:hover{color:var(--primary);transform:translateX(4px)}
.footer-brand .logo{color:#fff;margin-bottom:10px}
.footer-brand p{font-size:14px;color:#a1a1aa;max-width:340px}
.footer-social{display:flex;gap:10px;margin-top:16px}
.footer-social a{width:36px;height:36px;border-radius:10px;background:#27272a;display:grid;place-items:center;color:#d4d4d8;padding:0;transition:all .3s var(--ease)}
.footer-social a:hover{background:var(--primary);color:#fff;transform:translateY(-3px) rotate(5deg);box-shadow:0 8px 20px rgba(139,92,246,.4)}
.footer-bottom{border-top:1px solid #27272a;padding-top:18px;font-size:13px;color:#a1a1aa;display:flex;justify-content:space-between;flex-wrap:wrap;gap:10px}

/* ============ ADS ============ */
.ad-slot{margin:24px 0;padding:14px;background:#fff;border:1px dashed var(--border);border-radius:14px;text-align:center;min-height:60px;display:flex;align-items:center;justify-content:center;color:var(--muted);font-size:12px;position:relative;padding-top:24px;transition:all .3s var(--ease)}
.ad-slot:hover{border-color:var(--primary);background:var(--light-purple)}
.ad-slot::before{content:"Advertisement";position:absolute;top:6px;left:14px;font-size:10px;color:var(--muted);letter-spacing:1px;text-transform:uppercase}

/* ============ PAGINATION ============ */
.pagination{display:flex;gap:6px;justify-content:center;padding:22px 0;flex-wrap:wrap}
.pagination a,.pagination span{padding:8px 13px;border-radius:10px;background:#fff;border:1px solid var(--border);font-size:14px;font-weight:600;color:var(--text);transition:all .25s var(--ease)}
.pagination a:hover{border-color:var(--primary);color:var(--primary-dark);transform:translateY(-2px);box-shadow:0 4px 12px rgba(139,92,246,.2)}
.pagination .active{background:var(--primary);color:#fff;border-color:var(--primary);box-shadow:0 4px 12px rgba(139,92,246,.4)}
.pagination .disabled{opacity:.4;pointer-events:none}

/* ============ NEWSLETTER ============ */
.newsletter-box{background:linear-gradient(135deg,var(--primary),var(--secondary));color:#fff;border-radius:var(--radius);padding:36px;text-align:center;position:relative;overflow:hidden;box-shadow:0 20px 50px rgba(139,92,246,.3)}
.newsletter-box::before{content:"";position:absolute;top:-50%;left:-50%;width:200%;height:200%;background:radial-gradient(circle,rgba(255,255,255,.15) 0%,transparent 60%);animation:rotate 20s linear infinite}
@keyframes rotate{from{transform:rotate(0)}to{transform:rotate(360deg)}}
.newsletter-box h3{font-size:24px;margin-bottom:8px;font-weight:800;position:relative}
.newsletter-box p{opacity:.92;margin-bottom:18px;position:relative}
.newsletter-form{display:flex;gap:10px;max-width:480px;margin:0 auto;position:relative}
.newsletter-form input{flex:1;padding:13px 16px;border-radius:12px;border:none;font-size:15px;transition:all .25s var(--ease)}
.newsletter-form input:focus{outline:2px solid #fff;transform:translateY(-2px);box-shadow:0 10px 30px rgba(0,0,0,.2)}
.newsletter-form button{background:#18181b;color:#fff;border:none;padding:13px 22px;border-radius:12px;font-weight:700;cursor:pointer;transition:all .3s var(--ease)}
.newsletter-form button:hover{background:#000;transform:translateY(-2px);box-shadow:0 10px 30px rgba(0,0,0,.3)}

/* ============ SEARCH ============ */
.search-header{background:#fff;padding:26px 0;border-bottom:1px solid var(--border);animation:fadeUp .4s var(--ease-out) both}
.search-input-wrap{display:flex;gap:10px;max-width:720px;margin:0 auto}
.search-input{flex:1;padding:13px 18px;border-radius:12px;border:1px solid var(--border);font-size:15px;background:var(--background);transition:all .25s var(--ease)}
.search-input:focus{outline:none;border-color:var(--primary);box-shadow:0 0 0 4px rgba(139,92,246,.15);background:#fff;transform:translateY(-2px)}
.filters{display:flex;gap:10px;flex-wrap:wrap;margin:20px 0}
.filter-pill{padding:7px 14px;border-radius:999px;background:#fff;border:1px solid var(--border);font-size:13px;font-weight:600;cursor:pointer;transition:all .25s var(--ease);color:var(--text)}
.filter-pill:hover{border-color:var(--primary);color:var(--primary-dark);transform:translateY(-2px);box-shadow:0 4px 12px rgba(139,92,246,.15)}
.filter-pill.active{background:var(--primary);color:#fff;border-color:var(--primary);box-shadow:0 4px 12px rgba(139,92,246,.35)}

/* ============ EMPTY ============ */
.empty{text-align:center;padding:70px 20px;color:var(--muted);animation:fadeUp .5s var(--ease-out) both}
.empty svg{width:80px;height:80px;opacity:.4;margin-bottom:16px;animation:float 3s ease-in-out infinite}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
.empty h3{color:var(--text);font-size:20px;margin-bottom:6px}

/* ============ TOAST ============ */
.toast-wrap{position:fixed;bottom:22px;right:22px;display:flex;flex-direction:column;gap:10px;z-index:9999}
.toast{background:#18181b;color:#fff;padding:13px 18px;border-radius:12px;font-size:14px;box-shadow:0 10px 40px rgba(0,0,0,.25);animation:toastIn .35s var(--ease-out);min-width:220px;border-left:3px solid var(--primary)}
.toast.success{background:#16a34a;border-left-color:#4ade80}
.toast.error{background:#dc2626;border-left-color:#f87171}
.toast.warn{background:#d97706;border-left-color:#fbbf24}
@keyframes toastIn{from{opacity:0;transform:translateY(20px) scale(.9)}to{opacity:1;transform:translateY(0) scale(1)}}

/* ============ MOBILE DRAWER ============ */
.drawer-backdrop{position:fixed;inset:0;background:rgba(0,0,0,.5);opacity:0;pointer-events:none;transition:opacity .3s var(--ease);z-index:200;backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px)}
.drawer-backdrop.open{opacity:1;pointer-events:auto}
.drawer{position:fixed;top:0;bottom:0;left:0;width:82%;max-width:340px;background:#fff;transform:translateX(-100%);transition:transform .35s var(--ease);z-index:201;padding:22px;overflow-y:auto;box-shadow:4px 0 30px rgba(0,0,0,.1)}
.drawer.open{transform:translateX(0)}
.drawer-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:22px}
.drawer nav{display:flex;flex-direction:column;gap:4px}
.drawer nav a{padding:12px 14px;border-radius:11px;font-weight:600;transition:all .25s var(--ease);opacity:0;transform:translateX(-10px);animation:slideIn .3s var(--ease-out) forwards}
@keyframes slideIn{to{opacity:1;transform:translateX(0)}}
.drawer.open nav a:nth-child(1){animation-delay:.08s}
.drawer.open nav a:nth-child(2){animation-delay:.12s}
.drawer.open nav a:nth-child(3){animation-delay:.16s}
.drawer.open nav a:nth-child(4){animation-delay:.2s}
.drawer.open nav a:nth-child(5){animation-delay:.24s}
.drawer.open nav a:nth-child(6){animation-delay:.28s}
.drawer nav a:hover{background:var(--light-purple);color:var(--primary-dark);transform:translateX(4px)}

/* ============ SKELETON ============ */
.skel{background:linear-gradient(90deg,#eee 25%,#f5f5f5 50%,#eee 75%);background-size:200% 100%;animation:shimmer 1.4s infinite;border-radius:8px}
@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}

/* ============ UTILITY ANIMATIONS ============ */
@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}

/* ============ DARK MODE ============ */
body.dark{--background:#0a0a0a;--white:#18181b;--text:#fafafa;--muted:#a1a1aa;--border:#27272a;--light-purple:#2a1d4a}
body.dark .site-header{background:rgba(24,24,27,.92)}
body.dark .side-card,body.dark .card,body.dark .side-block,body.dark .search-header,body.dark .article-card{background:#18181b}
body.dark .hero-main{background:#000}
body.dark .article-card .article-content{color:#e4e4e7}
body.dark .article-card .article-header h1{-webkit-text-fill-color:#fafafa;background:none}
body.dark .article-card .share-row{background:#27272a;border-color:#3f3f46}
body.dark .share-row{background:#18181b}
body.dark .comments-list-box,body.dark .comment-form-box{background:#18181b}
body.dark .comment-form-box input,body.dark .comment-form-box textarea{background:#0a0a0a;border-color:#27272a;color:#fafafa}
body.dark .comment-body{color:#d4d4d8}
body.dark .article-content{color:#e4e4e7}
body.dark .article-content blockquote{color:#a1a1aa;background:linear-gradient(90deg,rgba(42,29,74,.5),transparent)}
body.dark .pop-item:hover{background:rgba(139,92,246,.15)}
body.dark .nav a:hover{background:rgba(139,92,246,.15)}
body.dark .filters input,body.dark .filters select{background:#18181b;color:#fafafa}
body.dark .filter-pill{background:#18181b;color:#fafafa}
body.dark .pagination a,body.dark .pagination span{background:#18181b;color:#fafafa}

/* ============ RESPONSIVE ============ */
@media (max-width:1024px){
  .hero-grid{grid-template-columns:1fr}
  .grid-4{grid-template-columns:repeat(2,1fr)}
  .grid-3{grid-template-columns:repeat(2,1fr)}
  .article-wrap{grid-template-columns:1fr}
  .footer-grid{grid-template-columns:1fr 1fr}
  .nav{display:none}
  .mobile-toggle{display:grid}
}
@media (max-width:640px){
  .grid-4,.grid-3,.grid-2{grid-template-columns:1fr}
  .footer-grid{grid-template-columns:1fr;gap:22px}
  .header-actions .btn-outline{display:none}
  .hero-overlay{padding:16px}
  .hero-overlay h1{font-size:20px}
  .section{padding:24px 0}
  .newsletter-form{flex-direction:column}
  .container{padding:0 14px}
  .toast-wrap{left:14px;right:14px;bottom:14px}
  .article-card{padding:20px 18px;border-radius:14px}
  .article-card .article-header h1{font-size:22px}
  .comment-form-box .form-row-2{grid-template-columns:1fr}
  .comments-list-box,.comment-form-box{padding:18px}
}

/* ============ REDUCED MOTION ============ */
@media (prefers-reduced-motion: reduce){
  *,*::before,*::after{animation-duration:.01ms !important;animation-iteration-count:1 !important;transition-duration:.01ms !important;scroll-behavior:auto !important}
}
`;

export const ADMIN_CSS = `
:root{
  --primary:#8b5cf6;--primary-dark:#7c3aed;--secondary:#a855f7;
  --light-purple:#f3e8ff;--bg:#faf5ff;--white:#fff;--text:#18181b;--muted:#71717a;
  --border:#e4e4e7;--success:#22c55e;--danger:#ef4444;--warning:#f59e0b;
  --radius:14px;--shadow:0 8px 30px rgba(0,0,0,.06);--sidebar-w:250px;
  --shadow-lg:0 20px 50px rgba(139,92,246,.15);
  --ease:cubic-bezier(.4,0,.2,1);
  --ease-out:cubic-bezier(0,0,.2,1);
}
*{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;background:var(--bg);color:var(--text);line-height:1.5;font-size:14px;-webkit-font-smoothing:antialiased;animation:adminFade .4s var(--ease-out)}
@keyframes adminFade{from{opacity:0}to{opacity:1}}
a{color:inherit;text-decoration:none}
img{max-width:100%;display:block}
button,input,textarea,select{font-family:inherit;font-size:inherit}
::selection{background:var(--primary);color:#fff}
::-webkit-scrollbar{width:8px;height:8px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:rgba(139,92,246,.3);border-radius:4px}
::-webkit-scrollbar-thumb:hover{background:var(--primary)}

/* ============ LOGIN ============ */
.login-wrap{min-height:100vh;display:grid;place-items:center;padding:24px;background:linear-gradient(135deg,#faf5ff,#ede9fe);position:relative;overflow:hidden}
.login-wrap::before{content:"";position:absolute;top:-30%;right:-30%;width:60%;height:60%;background:radial-gradient(circle,rgba(139,92,246,.15),transparent 70%);animation:float1 8s ease-in-out infinite}
.login-wrap::after{content:"";position:absolute;bottom:-30%;left:-30%;width:60%;height:60%;background:radial-gradient(circle,rgba(168,85,247,.15),transparent 70%);animation:float1 10s ease-in-out infinite reverse}
@keyframes float1{0%,100%{transform:translate(0,0)}50%{transform:translate(30px,-30px)}}
.login-card{background:#fff;padding:38px;border-radius:20px;box-shadow:0 20px 60px rgba(139,92,246,.15);width:100%;max-width:420px;position:relative;z-index:1;animation:cardIn .6s var(--ease-out)}
@keyframes cardIn{from{opacity:0;transform:translateY(20px) scale(.97)}to{opacity:1;transform:translateY(0) scale(1)}}
.login-card h1{font-size:24px;margin-bottom:6px;font-weight:800}
.login-card p.sub{color:var(--muted);margin-bottom:24px}
.logo{display:flex;align-items:center;gap:10px;font-weight:800;font-size:20px;color:var(--primary-dark);margin-bottom:24px}
.logo-mark{width:34px;height:34px;background:linear-gradient(135deg,var(--primary),var(--secondary));border-radius:10px;display:grid;place-items:center;color:#fff;font-weight:900;box-shadow:0 4px 12px rgba(139,92,246,.35)}

/* ============ FIELDS ============ */
.field{margin-bottom:16px}
.field label{display:block;font-size:13px;font-weight:600;margin-bottom:6px;color:#3f3f46}
.field input,.field select,.field textarea{width:100%;padding:11px 14px;border-radius:11px;border:1px solid var(--border);background:#fff;outline:none;transition:all .25s var(--ease);font-size:14px;color:var(--text)}
.field input:focus,.field select:focus,.field textarea:focus{border-color:var(--primary);box-shadow:0 0 0 4px rgba(139,92,246,.13);transform:translateY(-1px)}
.field textarea{resize:vertical;min-height:110px;font-family:inherit}
.field .hint{font-size:12px;color:var(--muted);margin-top:4px}

/* ============ BUTTONS ============ */
.btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:10px 18px;border-radius:11px;font-weight:600;font-size:14px;cursor:pointer;border:1px solid transparent;transition:all .25s var(--ease);white-space:nowrap;position:relative;overflow:hidden}
.btn::before{content:"";position:absolute;inset:0;background:linear-gradient(120deg,transparent 30%,rgba(255,255,255,.25),transparent 70%);transform:translateX(-100%);transition:transform .6s var(--ease)}
.btn:hover:not(:disabled)::before{transform:translateX(100%)}
.btn:disabled{opacity:.6;cursor:not-allowed}
.btn-primary{background:var(--primary);color:#fff;box-shadow:0 4px 14px rgba(139,92,246,.25)}
.btn-primary:hover:not(:disabled){background:var(--primary-dark);transform:translateY(-2px);box-shadow:0 8px 22px rgba(139,92,246,.4)}
.btn-primary:active:not(:disabled){transform:translateY(0) scale(.98)}
.btn-outline{background:#fff;border-color:var(--border);color:var(--text)}
.btn-outline:hover:not(:disabled){border-color:var(--primary);color:var(--primary-dark);background:var(--light-purple);transform:translateY(-2px)}
.btn-danger{background:var(--danger);color:#fff;box-shadow:0 4px 14px rgba(239,68,68,.25)}
.btn-danger:hover:not(:disabled){background:#dc2626;transform:translateY(-2px);box-shadow:0 8px 22px rgba(239,68,68,.4)}
.btn-sm{padding:6px 12px;font-size:13px}
.btn-block{width:100%}

/* ============ LAYOUT ============ */
.layout{display:grid;grid-template-columns:var(--sidebar-w) 1fr;min-height:100vh}
.sidebar{background:#fff;border-right:1px solid var(--border);padding:20px 14px;position:sticky;top:0;height:100vh;overflow-y:auto;transition:transform .35s var(--ease)}
.sidebar .logo{padding:0 10px;margin-bottom:26px;font-size:17px}
.nav-group{margin-bottom:20px;animation:fadeUp .4s var(--ease-out) both}
.nav-group:nth-child(1){animation-delay:.05s}
.nav-group:nth-child(2){animation-delay:.1s}
.nav-group:nth-child(3){animation-delay:.15s}
.nav-group:nth-child(4){animation-delay:.2s}
.nav-group:nth-child(5){animation-delay:.25s}
@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
.nav-group h5{font-size:10px;text-transform:uppercase;letter-spacing:1px;color:var(--muted);padding:0 10px;margin-bottom:8px;font-weight:700}
.nav-group a{display:flex;align-items:center;gap:11px;padding:9px 12px;border-radius:10px;font-size:13.5px;font-weight:500;color:#52525b;transition:all .25s var(--ease);margin-bottom:2px;position:relative;overflow:hidden}
.nav-group a::before{content:"";position:absolute;left:0;top:50%;width:3px;height:0;background:var(--primary);border-radius:0 3px 3px 0;transform:translateY(-50%);transition:height .3s var(--ease)}
.nav-group a:hover{background:var(--light-purple);color:var(--primary-dark);transform:translateX(3px)}
.nav-group a:hover::before{height:60%}
.nav-group a.active{background:linear-gradient(135deg,var(--primary),var(--secondary));color:#fff;box-shadow:0 4px 14px rgba(139,92,246,.3)}
.nav-group a.active::before{background:#fff;height:60%}
.nav-group a svg{width:17px;height:17px;flex-shrink:0;transition:transform .3s var(--ease)}
.nav-group a:hover svg{transform:scale(1.15) rotate(-5deg)}
.main{padding:0 0 40px}
.topbar{background:rgba(255,255,255,.92);backdrop-filter:saturate(180%) blur(12px);-webkit-backdrop-filter:saturate(180%) blur(12px);border-bottom:1px solid var(--border);padding:14px 28px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:50}
.topbar h2{font-size:18px;font-weight:700}
.topbar .user{display:flex;align-items:center;gap:12px;font-size:13px}
.avatar{width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,var(--primary),var(--secondary));color:#fff;display:grid;place-items:center;font-weight:700;font-size:14px;overflow:hidden;box-shadow:0 4px 12px rgba(139,92,246,.3);transition:transform .3s var(--ease)}
.avatar:hover{transform:scale(1.08)}
.avatar img{width:100%;height:100%;object-fit:cover}
.content{padding:26px 28px}
.page-head{display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;margin-bottom:22px;animation:fadeUp .4s var(--ease-out) both}
.page-head h1{font-size:22px;font-weight:800;background:linear-gradient(135deg,var(--text) 30%,var(--primary-dark));-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
.page-head .sub{color:var(--muted);font-size:13px;margin-top:3px}
.card{background:#fff;border-radius:var(--radius);box-shadow:var(--shadow);padding:20px;margin-bottom:22px;animation:fadeUp .45s var(--ease-out) both;transition:box-shadow .3s var(--ease)}
.card:hover{box-shadow:0 12px 40px rgba(0,0,0,.08)}
.card h3{font-size:15px;font-weight:700;margin-bottom:14px;display:flex;align-items:center;justify-content:space-between;gap:10px}

/* ============ STATS ============ */
.stats-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:18px;margin-bottom:26px}
.stat{background:#fff;border-radius:var(--radius);box-shadow:var(--shadow);padding:20px;position:relative;overflow:hidden;transition:all .35s var(--ease);animation:fadeUp .45s var(--ease-out) both}
.stat:nth-child(1){animation-delay:.02s}
.stat:nth-child(2){animation-delay:.06s}
.stat:nth-child(3){animation-delay:.1s}
.stat:nth-child(4){animation-delay:.14s}
.stat:nth-child(5){animation-delay:.18s}
.stat:nth-child(6){animation-delay:.22s}
.stat:nth-child(7){animation-delay:.26s}
.stat:nth-child(8){animation-delay:.3s}
.stat::before{content:"";position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,var(--primary),var(--secondary));transform:scaleX(0);transform-origin:left;transition:transform .4s var(--ease)}
.stat:hover{transform:translateY(-4px);box-shadow:var(--shadow-lg)}
.stat:hover::before{transform:scaleX(1)}
.stat .lbl{font-size:12px;color:var(--muted);text-transform:uppercase;letter-spacing:.5px;font-weight:600}
.stat .val{font-size:28px;font-weight:800;margin:8px 0 4px;color:var(--text);transition:transform .3s var(--ease)}
.stat:hover .val{transform:scale(1.05);color:var(--primary-dark)}
.stat .sub{font-size:12px;color:var(--muted)}
.stat .icon{position:absolute;top:16px;right:16px;width:38px;height:38px;border-radius:11px;background:var(--light-purple);display:grid;place-items:center;color:var(--primary-dark);transition:transform .3s var(--ease)}
.stat:hover .icon{transform:rotate(-10deg) scale(1.1)}

/* ============ TABLES ============ */
table{width:100%;border-collapse:collapse;font-size:13.5px}
table th{text-align:left;padding:10px 12px;font-weight:700;color:var(--muted);text-transform:uppercase;font-size:11px;letter-spacing:.5px;border-bottom:1px solid var(--border)}
table td{padding:12px;border-bottom:1px solid var(--border);vertical-align:middle;transition:background .2s var(--ease)}
table tbody tr{transition:all .2s var(--ease);animation:rowIn .3s var(--ease-out) both}
table tbody tr:nth-child(1){animation-delay:.02s}
table tbody tr:nth-child(2){animation-delay:.04s}
table tbody tr:nth-child(3){animation-delay:.06s}
table tbody tr:nth-child(4){animation-delay:.08s}
table tbody tr:nth-child(5){animation-delay:.1s}
@keyframes rowIn{from{opacity:0;transform:translateX(-8px)}to{opacity:1;transform:translateX(0)}}
table tr:hover td{background:#fafafa}
.tbl-thumb{width:44px;height:44px;border-radius:9px;object-fit:cover;background:#f4f4f5;transition:transform .3s var(--ease)}
tr:hover .tbl-thumb{transform:scale(1.1) rotate(-3deg)}
.tbl-actions{display:flex;gap:6px;flex-wrap:wrap}

/* ============ PILLS ============ */
.pill{display:inline-block;padding:3px 10px;border-radius:999px;font-size:11px;font-weight:700;text-transform:uppercase;transition:transform .2s var(--ease)}
.pill:hover{transform:scale(1.08)}
.pill.published{background:#dcfce7;color:#166534}
.pill.draft{background:#fef3c7;color:#92400e}
.pill.scheduled{background:#dbeafe;color:#1e40af}
.pill.archived{background:#e4e4e7;color:#3f3f46}
.pill.pending{background:#fef3c7;color:#92400e}
.pill.approved{background:#dcfce7;color:#166534}
.pill.rejected{background:#fee2e2;color:#991b1b}
.pill.spam{background:#e4e4e7;color:#3f3f46}
.pill.active{background:#dcfce7;color:#166534}
.pill.inactive{background:#e4e4e7;color:#3f3f46}

/* ============ FILTERS ============ */
.filters{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:18px;align-items:center}
.filters input,.filters select{padding:9px 13px;border-radius:10px;border:1px solid var(--border);background:#fff;font-size:13.5px;outline:none;transition:all .25s var(--ease)}
.filters input:focus,.filters select:focus{border-color:var(--primary);box-shadow:0 0 0 3px rgba(139,92,246,.13);transform:translateY(-1px)}
.grid2{display:grid;grid-template-columns:2fr 1fr;gap:20px}
.grid2-eq{display:grid;grid-template-columns:1fr 1fr;gap:20px}
@media (max-width:900px){.grid2,.grid2-eq{grid-template-columns:1fr}}

/* ============ MODAL ============ */
.modal-backdrop{position:fixed;inset:0;background:rgba(0,0,0,.5);display:none;align-items:center;justify-content:center;z-index:1000;padding:16px;backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px)}
.modal-backdrop.open{display:flex;animation:fadeIn .2s var(--ease)}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
.modal{background:#fff;border-radius:16px;padding:24px;width:100%;max-width:560px;max-height:92vh;overflow-y:auto;box-shadow:0 30px 80px rgba(0,0,0,.3);animation:modalIn .3s var(--ease-out)}
@keyframes modalIn{from{opacity:0;transform:translateY(20px) scale(.95)}to{opacity:1;transform:translateY(0) scale(1)}}
.modal h3{font-size:18px;font-weight:800;margin-bottom:14px}
.modal-actions{display:flex;gap:10px;justify-content:flex-end;margin-top:22px}

/* ============ TOAST ============ */
.toast-wrap{position:fixed;top:20px;right:20px;display:flex;flex-direction:column;gap:10px;z-index:9999;max-width:340px}
.toast{background:#18181b;color:#fff;padding:12px 16px;border-radius:12px;font-size:13.5px;box-shadow:0 10px 40px rgba(0,0,0,.25);animation:tin .35s var(--ease-out);border-left:3px solid var(--primary)}
.toast.success{background:#16a34a;border-left-color:#4ade80}
.toast.error{background:#dc2626;border-left-color:#f87171}
.toast.warn{background:#d97706;border-left-color:#fbbf24}
@keyframes tin{from{opacity:0;transform:translateX(30px) scale(.9)}to{opacity:1;transform:translateX(0) scale(1)}}

/* ============ EMPTY & SKELETON ============ */
.empty{text-align:center;padding:60px 20px;color:var(--muted);animation:fadeUp .4s var(--ease-out)}
.empty h3{color:var(--text);margin-bottom:6px}
.skel{background:linear-gradient(90deg,#eee 25%,#f5f5f5 50%,#eee 75%);background-size:200% 100%;animation:shimmer 1.4s infinite;border-radius:8px;height:14px;margin:8px 0}
@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}

/* ============ MOBILE MENU ============ */
.mobile-menu-btn{display:none;background:#fff;border:1px solid var(--border);width:40px;height:40px;border-radius:10px;cursor:pointer;transition:all .25s var(--ease)}
.mobile-menu-btn:hover{background:var(--light-purple);border-color:var(--primary)}
.mobile-drawer-backdrop{position:fixed;inset:0;background:rgba(0,0,0,.4);opacity:0;pointer-events:none;transition:opacity .3s var(--ease);z-index:200;backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px)}
.mobile-drawer-backdrop.open{opacity:1;pointer-events:auto}

/* ============ TABS ============ */
.tabs{display:flex;gap:6px;border-bottom:1px solid var(--border);margin-bottom:18px;flex-wrap:wrap}
.tab{padding:9px 15px;font-size:13.5px;font-weight:600;color:var(--muted);cursor:pointer;border-bottom:2px solid transparent;margin-bottom:-1px;transition:all .25s var(--ease);position:relative}
.tab:hover{color:var(--primary-dark)}
.tab.active{color:var(--primary-dark);border-bottom-color:var(--primary)}

/* ============ EDITOR ============ */
.editor-toolbar{display:flex;gap:4px;flex-wrap:wrap;background:#fafafa;padding:8px;border-radius:12px 12px 0 0;border:1px solid var(--border);border-bottom:none}
.editor-toolbar button{background:#fff;border:1px solid var(--border);border-radius:8px;padding:6px 10px;cursor:pointer;font-size:13px;font-weight:600;color:#3f3f46;min-width:34px;display:grid;place-items:center;transition:all .2s var(--ease)}
.editor-toolbar button:hover{background:var(--light-purple);border-color:var(--primary);color:var(--primary-dark);transform:translateY(-2px)}
.editor-toolbar button:active{transform:translateY(0) scale(.95)}
.editor-area{min-height:380px;padding:18px;border:1px solid var(--border);border-radius:0 0 12px 12px;background:#fff;outline:none;font-size:15px;line-height:1.7;transition:all .25s var(--ease)}
.editor-area:focus{border-color:var(--primary);box-shadow:0 0 0 4px rgba(139,92,246,.1)}
.editor-area h2{font-size:22px;margin:16px 0 8px}
.editor-area h3{font-size:18px;margin:14px 0 6px}
.editor-area p{margin:0 0 12px}
.editor-area blockquote{border-left:4px solid var(--primary);padding:6px 14px;background:var(--light-purple);margin:12px 0;font-style:italic}
.editor-area ul,.editor-area ol{margin:0 0 12px 22px}
.editor-area img{border-radius:10px;margin:10px 0}
.form-row{display:grid;grid-template-columns:1fr 1fr;gap:16px}
@media (max-width:700px){.form-row{grid-template-columns:1fr}}

/* ============ SWITCH ============ */
.switch{position:relative;display:inline-block;width:42px;height:24px}
.switch input{opacity:0;width:0;height:0}
.slider{position:absolute;inset:0;background:#d4d4d8;border-radius:24px;cursor:pointer;transition:.25s var(--ease)}
.slider::before{content:"";position:absolute;height:18px;width:18px;left:3px;top:3px;background:#fff;border-radius:50%;transition:.25s var(--ease);box-shadow:0 2px 6px rgba(0,0,0,.15)}
input:checked + .slider{background:var(--primary)}
input:checked + .slider::before{transform:translateX(18px)}

/* ============ RESPONSIVE ============ */
@media (max-width:900px){
  .layout{grid-template-columns:1fr}
  .sidebar{position:fixed;left:0;top:0;bottom:0;z-index:300;transform:translateX(-100%);width:270px;height:100vh;box-shadow:4px 0 30px rgba(0,0,0,.15)}
  .sidebar.open{transform:translateX(0)}
  .mobile-menu-btn{display:grid}
  .content{padding:18px 14px}
  .topbar{padding:12px 14px}
  table{font-size:12.5px}
  table th,table td{padding:8px}
}

/* ============ DARK ============ */
body.dark{--bg:#0a0a0a;--white:#18181b;--text:#fafafa;--muted:#a1a1aa;--border:#27272a;--light-purple:#2a1d4a}
body.dark .card,body.dark .stat,body.dark .sidebar,body.dark .topbar,body.dark .modal{background:#18181b}
body.dark .field input,body.dark .field select,body.dark .field textarea,body.dark .filters input,body.dark .filters select{background:#0a0a0a;border-color:#27272a;color:#fafafa}
body.dark table tr:hover td{background:#18181b}
body.dark .editor-toolbar{background:#18181b}
body.dark .editor-toolbar button{background:#27272a;color:#e4e4e7;border-color:#3f3f46}
body.dark .editor-area{background:#0a0a0a;color:#fafafa}
body.dark .nav-group a{color:#a1a1aa}
body.dark .nav-group a:hover{background:#2a1d4a;color:#c4b5fd}

/* ============ REDUCED MOTION ============ */
@media (prefers-reduced-motion: reduce){
  *,*::before,*::after{animation-duration:.01ms !important;animation-iteration-count:1 !important;transition-duration:.01ms !important;scroll-behavior:auto !important}
}
`;
