-- =========================================================
-- News CMS — Initial Schema
-- =========================================================

PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  name          TEXT NOT NULL,
  email         TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role          TEXT NOT NULL DEFAULT 'user',
  avatar        TEXT,
  status        TEXT NOT NULL DEFAULT 'active',
  created_at    TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at    TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role  ON users(role);

CREATE TABLE IF NOT EXISTS sessions (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id    INTEGER NOT NULL,
  token_hash TEXT NOT NULL UNIQUE,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token_hash);
CREATE INDEX IF NOT EXISTS idx_sessions_user  ON sessions(user_id);

CREATE TABLE IF NOT EXISTS categories (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  name             TEXT NOT NULL,
  slug             TEXT NOT NULL UNIQUE,
  description      TEXT,
  image            TEXT,
  meta_title       TEXT,
  meta_description TEXT,
  status           TEXT NOT NULL DEFAULT 'active',
  sort_order       INTEGER NOT NULL DEFAULT 0,
  created_at       TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at       TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);

CREATE TABLE IF NOT EXISTS authors (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  bio         TEXT,
  avatar      TEXT,
  email       TEXT,
  social_links TEXT,
  status      TEXT NOT NULL DEFAULT 'active',
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_authors_slug ON authors(slug);

CREATE TABLE IF NOT EXISTS news (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  title            TEXT NOT NULL,
  slug             TEXT NOT NULL UNIQUE,
  excerpt          TEXT,
  content          TEXT,
  featured_image   TEXT,
  thumbnail        TEXT,
  category_id      INTEGER,
  author_id        INTEGER,
  status           TEXT NOT NULL DEFAULT 'draft',
  visibility       TEXT NOT NULL DEFAULT 'public',
  is_featured      INTEGER NOT NULL DEFAULT 0,
  is_trending      INTEGER NOT NULL DEFAULT 0,
  is_breaking      INTEGER NOT NULL DEFAULT 0,
  views            INTEGER NOT NULL DEFAULT 0,
  meta_title       TEXT,
  meta_description TEXT,
  meta_keywords    TEXT,
  canonical_url    TEXT,
  published_at     TEXT,
  scheduled_at     TEXT,
  created_at       TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at       TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
  FOREIGN KEY (author_id)   REFERENCES authors(id)    ON DELETE SET NULL
);
CREATE INDEX IF NOT EXISTS idx_news_slug         ON news(slug);
CREATE INDEX IF NOT EXISTS idx_news_category     ON news(category_id);
CREATE INDEX IF NOT EXISTS idx_news_author       ON news(author_id);
CREATE INDEX IF NOT EXISTS idx_news_status       ON news(status);
CREATE INDEX IF NOT EXISTS idx_news_published_at ON news(published_at);
CREATE INDEX IF NOT EXISTS idx_news_views        ON news(views);
CREATE INDEX IF NOT EXISTS idx_news_featured     ON news(is_featured);
CREATE INDEX IF NOT EXISTS idx_news_trending     ON news(is_trending);
CREATE INDEX IF NOT EXISTS idx_news_breaking     ON news(is_breaking);

CREATE TABLE IF NOT EXISTS tags (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  name       TEXT NOT NULL UNIQUE,
  slug       TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_tags_slug ON tags(slug);

CREATE TABLE IF NOT EXISTS news_tags (
  news_id INTEGER NOT NULL,
  tag_id  INTEGER NOT NULL,
  PRIMARY KEY (news_id, tag_id),
  FOREIGN KEY (news_id) REFERENCES news(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id)  REFERENCES tags(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS comments (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  news_id    INTEGER NOT NULL,
  user_id    INTEGER,
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  content    TEXT NOT NULL,
  status     TEXT NOT NULL DEFAULT 'pending',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (news_id) REFERENCES news(id)  ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);
CREATE INDEX IF NOT EXISTS idx_comments_news   ON comments(news_id);
CREATE INDEX IF NOT EXISTS idx_comments_status ON comments(status);

CREATE TABLE IF NOT EXISTS media (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  filename    TEXT NOT NULL,
  url         TEXT NOT NULL,
  type        TEXT,
  size        INTEGER DEFAULT 0,
  alt_text    TEXT,
  uploaded_by INTEGER,
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS advertisements (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  name       TEXT NOT NULL,
  position   TEXT NOT NULL,
  code       TEXT,
  image_url  TEXT,
  target_url TEXT,
  status     TEXT NOT NULL DEFAULT 'active',
  start_date TEXT,
  end_date   TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_ads_position ON advertisements(position);

CREATE TABLE IF NOT EXISTS pages (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  title            TEXT NOT NULL,
  slug             TEXT NOT NULL UNIQUE,
  content          TEXT,
  meta_title       TEXT,
  meta_description TEXT,
  status           TEXT NOT NULL DEFAULT 'published',
  created_at       TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at       TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS settings (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  setting_key   TEXT NOT NULL UNIQUE,
  setting_value TEXT,
  updated_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS navigation (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  title      TEXT NOT NULL,
  url        TEXT NOT NULL,
  type       TEXT NOT NULL DEFAULT 'link',
  parent_id  INTEGER,
  sort_order INTEGER NOT NULL DEFAULT 0,
  status     TEXT NOT NULL DEFAULT 'active',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (parent_id) REFERENCES navigation(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS newsletter (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  email      TEXT NOT NULL UNIQUE,
  status     TEXT NOT NULL DEFAULT 'active',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS activity_logs (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id     INTEGER,
  action      TEXT NOT NULL,
  entity_type TEXT,
  entity_id   INTEGER,
  ip_address  TEXT,
  user_agent  TEXT,
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- ============ SEED ============
INSERT OR IGNORE INTO categories (name, slug, description, sort_order) VALUES
  ('Technology',    'technology',    'Latest technology news', 1),
  ('Business',      'business',      'Business & markets',     2),
  ('Jobs',          'jobs',          'Jobs & careers',         3),
  ('Education',     'education',     'Education news',         4),
  ('Sports',        'sports',        'Sports updates',         5),
  ('Entertainment', 'entertainment', 'Entertainment news',     6),
  ('National',      'national',      'National news',          7),
  ('International', 'international', 'World news',             8);

INSERT OR IGNORE INTO pages (title, slug, content, status) VALUES
  ('About Us',           'about-us',         '<p>About our news portal.</p>',           'published'),
  ('Contact Us',         'contact-us',       '<p>Contact us page.</p>',                 'published'),
  ('Privacy Policy',     'privacy-policy',   '<p>Privacy Policy.</p>',                  'published'),
  ('Terms & Conditions', 'terms-conditions', '<p>Terms and conditions.</p>',           'published'),
  ('Disclaimer',         'disclaimer',       '<p>Disclaimer.</p>',                      'published');

INSERT OR IGNORE INTO settings (setting_key, setting_value) VALUES
  ('site_name',         'NewsHub'),
  ('tagline',           'Breaking News, Delivered Fast'),
  ('site_description',  'A premium news portal for the latest headlines.'),
  ('logo',              ''),
  ('favicon',           ''),
  ('contact_email',     'contact@example.com'),
  ('phone',             ''),
  ('address',           ''),
  ('facebook',          ''),
  ('instagram',         ''),
  ('youtube',           ''),
  ('twitter',           ''),
  ('telegram',          ''),
  ('whatsapp',          ''),
  ('primary_color',     '#8b5cf6'),
  ('secondary_color',   '#a855f7'),
  ('dark_mode',         '0'),
  ('comments_enabled',  '1'),
  ('registration_enabled','1'),
  ('newsletter_enabled','1'),
  ('breaking_enabled',  '1'),
  ('maintenance_mode',  '0'),
  ('hero_count',        '1'),
  ('latest_count',      '8'),
  ('trending_count',    '6'),
  ('featured_count',    '4'),
  ('show_hero',         '1'),
  ('show_latest',       '1'),
  ('show_trending',     '1'),
  ('show_featured',     '1'),
  ('show_newsletter',   '1'),
  ('show_sidebar',      '1'),
  ('copyright',         '© 2025 NewsHub. All rights reserved.'),
  ('seo_title',         'NewsHub — Breaking News'),
  ('seo_description',   'Latest news from around the world.'),
  ('seo_keywords',      'news, breaking news, headlines'),
  ('og_title',          'NewsHub'),
  ('og_description',    'Latest news from around the world.'),
  ('og_image',          ''),
  ('twitter_card',      'summary_large_image'),
  ('canonical_url',     '');

INSERT OR IGNORE INTO navigation (title, url, sort_order, status) VALUES
  ('Home',     '/',                0, 'active'),
  ('News',     '/search',          1, 'active'),
  ('Sport',    '/category/sports', 2, 'active'),
  ('Business', '/category/business', 3, 'active'),
  ('Tech',     '/category/technology', 4, 'active'),
  ('Contact',  '/page/contact-us', 5, 'active');
