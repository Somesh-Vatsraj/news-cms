# NewsHub — Cloudflare Workers + D1 News CMS

A complete, premium news publishing platform with admin CMS. Built entirely on **Cloudflare Workers + D1**, no separate backend, no external UI framework.

## Features

- Public news website (homepage, articles, categories, search, author pages, static pages)
- Breaking news ticker + featured + trending sections
- Secure admin dashboard with full CRUD for News, Categories, Authors, Users, Comments, Media, Ads, Pages, SEO, Settings, Navigation, Newsletter
- Password hashing with Web Crypto PBKDF2, HttpOnly session cookies
- Custom HTML/CSS/JS — no React/Vite/Tailwind/Bootstrap
- Rich text editor, bulk actions, modals, toasts, dark mode, responsive layout
- Auto-publish scheduled articles
- SEO: meta tags, Open Graph, JSON-LD, sitemap.xml, robots.txt

## Requirements

- A Cloudflare account
- Node.js 18+ and npm
- Wrangler CLI

## 1. Install

```bash
npm install
```

## 2. Login to Cloudflare

```bash
npx wrangler login
```

## 3. Create the D1 database

```bash
npx wrangler d1 create news_db
```

Copy the printed `database_id` and paste it into `wrangler.toml` under `[[d1_databases]]`.

## 4. Apply migrations (local)

```bash
npx wrangler d1 migrations apply DB --local
```

## 5. Local development

```bash
npm run dev
```

Open <http://localhost:8787>.

## 6. First admin setup

Visit:

```
http://localhost:8787/setup
```

Only works while no `admin` user exists. Create your admin.

Then log in at `/admin/login`.

## 7. Environment secrets

Set a session secret (defense-in-depth):

```bash
npx wrangler secret put SESSION_SECRET
```

Also set production `SITE_URL` in `wrangler.toml`:

```toml
[vars]
SITE_URL = "https://your-domain.com"
```

## 8. Deploy

```bash
npx wrangler deploy
```

Then apply migrations to the remote DB:

```bash
npx wrangler d1 migrations apply DB --remote
```

## 9. Custom domain

Add route in `wrangler.toml`:

```toml
routes = [
  { pattern = "your-domain.com/*", zone_name = "your-domain.com" }
]
```

## 10. Media / R2 integration

The built-in Media manager stores **URLs** only. To upload binaries:

1. Create an R2 bucket: `npx wrangler r2 bucket create news-media`
2. Add to `wrangler.toml`:
   ```toml
   [[r2_buckets]]
   binding = "MEDIA"
   bucket_name = "news-media"
   ```
3. Serve via a public bucket or a Worker route.
4. Paste the resulting URL into the Media manager or the news editor image fields.

## 11. AdSense / ads

Paste official `<ins class="adsbygoogle">` code into **Admin → Advertisements → Add Ad → HTML/JS Ad Code**.
Only one `<script>` block per ad is required; the rest is loaded once globally.

## 12. Roles

| Role   | Capability |
| ------ | ---------- |
| admin  | Everything |
| editor | News, categories, comments (no user/settings changes) |
| author | Create own news |
| user   | Public account |

## 13. Security checklist

- [x] PBKDF2 password hashing (100k iterations, SHA-256)
- [x] HttpOnly, Secure, SameSite=Lax session cookies
- [x] Session tokens are stored hashed (SHA-256)
- [x] All SQL uses bound parameters
- [x] HTML content is sanitized before storage
- [x] Role-based authorization on every protected API
- [x] Set-Cookie invalidates session on password change
- [x] X-Frame-Options, X-Content-Type-Options on HTML responses
- [x] Admin routes have `noindex, nofollow`

## 14. Production checklist

- [ ] `SESSION_SECRET` set via `wrangler secret put`
- [ ] `SITE_URL` set to your production domain
- [ ] D1 migrations applied with `--remote`
- [ ] First admin created via `/setup`
- [ ] Maintenance mode OFF
- [ ] Site name / logo / favicon set in Settings
- [ ] Navigation configured
- [ ] Ads configured (only if you have real ads)
- [ ] Custom domain configured
- [ ] Verify `/sitemap.xml` and `/robots.txt`
- [ ] Check `/admin/login` is not indexed

## 15. Troubleshooting

**`D1_ERROR: no such table: users`** → Run `npx wrangler d1 migrations apply DB --local` (local) or `--remote` (prod).

**Login fails with valid password** → Confirm migrations ran; the initial admin must be created via `/setup`.

**Admin HTML pages redirect to `/admin/login`** → Cookie not set. Check that you're on HTTPS (or `localhost`), and that `SESSION_SECRET` was set for production.

**Images not showing** → Only URLs are stored in D1. Upload images to R2/Cloudflare Images and paste URLs.

**`wrangler deploy` says database_id missing** → Paste the real D1 id into `wrangler.toml`.

## License

MIT
