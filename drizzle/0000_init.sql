CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY,
  name text NOT NULL,
  email varchar(254) NOT NULL,
  password_hash text NOT NULL,
  role varchar(32) NOT NULL DEFAULT 'client' CHECK (role IN ('admin','client','partner','affiliate','employee')),
  preferred_locale varchar(2) NOT NULL DEFAULT 'pl' CHECK (preferred_locale IN ('pl','en','es')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS users_email_unique ON users(email);
CREATE INDEX IF NOT EXISTS users_role_idx ON users(role);

CREATE TABLE IF NOT EXISTS contact_requests (
  id uuid PRIMARY KEY,
  name text NOT NULL,
  email varchar(254) NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  consent boolean NOT NULL,
  consent_version varchar(32) NOT NULL,
  consent_at timestamptz NOT NULL,
  email_sent boolean NOT NULL DEFAULT false,
  legacy_mongo_id varchar(32),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS contact_requests_email_idx ON contact_requests(email);
CREATE INDEX IF NOT EXISTS contact_requests_created_idx ON contact_requests(created_at);

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id uuid PRIMARY KEY,
  email varchar(254) NOT NULL,
  consent boolean NOT NULL,
  consent_version varchar(32) NOT NULL,
  consent_at timestamptz NOT NULL,
  confirmation_token_hash varchar(64),
  confirmation_token_expires_at timestamptz,
  confirmed_at timestamptz,
  unsubscribed_at timestamptz,
  email_sent boolean NOT NULL DEFAULT false,
  legacy_mongo_id varchar(32),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS newsletter_subscribers_email_unique ON newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS newsletter_subscribers_token_idx ON newsletter_subscribers(confirmation_token_hash);

CREATE TABLE IF NOT EXISTS rate_limit_buckets (
  id uuid PRIMARY KEY,
  key varchar(512) NOT NULL,
  count integer NOT NULL DEFAULT 0,
  reset_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS rate_limit_buckets_key_unique ON rate_limit_buckets(key);
CREATE INDEX IF NOT EXISTS rate_limit_buckets_reset_idx ON rate_limit_buckets(reset_at);

CREATE TABLE IF NOT EXISTS hero_settings (
  id uuid PRIMARY KEY,
  locale varchar(2) NOT NULL CHECK (locale IN ('pl','en','es')),
  title_line1 text NOT NULL,
  title_line2 text NOT NULL,
  subtitle text NOT NULL,
  primary_cta_label text NOT NULL,
  primary_cta_href text NOT NULL,
  secondary_cta_label text NOT NULL,
  secondary_cta_href text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS hero_settings_locale_unique ON hero_settings(locale);

CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY,
  locale varchar(2) NOT NULL CHECK (locale IN ('pl','en','es')),
  section varchar(64) NOT NULL,
  title text NOT NULL,
  subtitle text NOT NULL,
  slug varchar(160) NOT NULL,
  short_description text NOT NULL,
  value_summary text NOT NULL,
  price_from text,
  duration text,
  bullets jsonb NOT NULL DEFAULT '[]'::jsonb,
  is_active boolean NOT NULL DEFAULT true,
  legacy_mongo_id varchar(32),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS services_slug_unique ON services(slug);
CREATE INDEX IF NOT EXISTS services_locale_idx ON services(locale);

CREATE TABLE IF NOT EXISTS offers (
  id uuid PRIMARY KEY,
  group_name varchar(64) NOT NULL,
  slug varchar(160) NOT NULL,
  locale varchar(2) NOT NULL CHECK (locale IN ('pl','en','es')),
  title text NOT NULL,
  subtitle text,
  price_from text,
  duration text,
  includes jsonb NOT NULL DEFAULT '[]'::jsonb,
  value text NOT NULL,
  ideal_for text,
  notes text,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  legacy_mongo_id varchar(32),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS offers_slug_unique ON offers(slug);
CREATE INDEX IF NOT EXISTS offers_locale_idx ON offers(locale);

CREATE TABLE IF NOT EXISTS insight_posts (
  id uuid PRIMARY KEY,
  title text NOT NULL,
  slug varchar(160) NOT NULL,
  category varchar(64) NOT NULL DEFAULT 'other',
  locale varchar(2) NOT NULL CHECK (locale IN ('pl','en','es')),
  excerpt text NOT NULL,
  content text NOT NULL,
  published_at timestamptz,
  legacy_mongo_id varchar(32),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS insight_posts_slug_unique ON insight_posts(slug);
CREATE INDEX IF NOT EXISTS insight_posts_locale_idx ON insight_posts(locale);
CREATE INDEX IF NOT EXISTS insight_posts_published_idx ON insight_posts(published_at);

CREATE TABLE IF NOT EXISTS legal_pages (
  id uuid PRIMARY KEY,
  slug varchar(64) NOT NULL,
  locale varchar(2) NOT NULL CHECK (locale IN ('pl','en','es')),
  title text NOT NULL,
  intro text,
  content text NOT NULL,
  last_updated timestamptz NOT NULL DEFAULT now(),
  is_active boolean NOT NULL DEFAULT true,
  legacy_mongo_id varchar(32),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS legal_pages_slug_locale_unique ON legal_pages(slug, locale);

CREATE TABLE IF NOT EXISTS media_assets (
  id uuid PRIMARY KEY,
  title text NOT NULL,
  slug varchar(160) NOT NULL,
  type varchar(16) NOT NULL CHECK (type IN ('image','video')),
  url text NOT NULL,
  thumbnail_url text,
  alt text,
  tags jsonb NOT NULL DEFAULT '[]'::jsonb,
  section text,
  locale varchar(2) NOT NULL CHECK (locale IN ('pl','en','es')),
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  legacy_mongo_id varchar(32),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS media_assets_slug_unique ON media_assets(slug);
CREATE INDEX IF NOT EXISTS media_assets_locale_idx ON media_assets(locale);

CREATE TABLE IF NOT EXISTS pages (
  id uuid PRIMARY KEY,
  page_id varchar(100) NOT NULL,
  slug varchar(160) NOT NULL,
  locale varchar(2) NOT NULL CHECK (locale IN ('pl','en','es')),
  title text NOT NULL,
  hero_title text,
  hero_subtitle text,
  lead text,
  main_content text,
  show_in_nav boolean NOT NULL DEFAULT false,
  nav_label text,
  sort_order integer NOT NULL DEFAULT 0,
  status varchar(16) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','review','published')),
  legacy_mongo_id varchar(32),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS pages_slug_locale_unique ON pages(slug, locale);
CREATE INDEX IF NOT EXISTS pages_page_id_idx ON pages(page_id);

CREATE TABLE IF NOT EXISTS partners (
  id uuid PRIMARY KEY,
  name text NOT NULL,
  type varchar(32) NOT NULL DEFAULT 'other',
  locale varchar(2) NOT NULL CHECK (locale IN ('pl','en','es')),
  description text NOT NULL,
  website_url text,
  logo_url text,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  legacy_mongo_id varchar(32),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS partners_locale_idx ON partners(locale);

CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY,
  actor_user_id uuid,
  action varchar(120) NOT NULL,
  entity varchar(120) NOT NULL,
  entity_id uuid,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS audit_logs_actor_idx ON audit_logs(actor_user_id);
CREATE INDEX IF NOT EXISTS audit_logs_created_idx ON audit_logs(created_at);
