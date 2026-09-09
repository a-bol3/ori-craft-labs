ALTER TABLE hero_settings ADD COLUMN IF NOT EXISTS status varchar(16) NOT NULL DEFAULT 'published';
ALTER TABLE hero_settings ADD COLUMN IF NOT EXISTS version integer NOT NULL DEFAULT 1;
ALTER TABLE hero_settings ADD COLUMN IF NOT EXISTS updated_by uuid;

ALTER TABLE services ADD COLUMN IF NOT EXISTS status varchar(16) NOT NULL DEFAULT 'published';
ALTER TABLE services ADD COLUMN IF NOT EXISTS version integer NOT NULL DEFAULT 1;
ALTER TABLE services ADD COLUMN IF NOT EXISTS updated_by uuid;

ALTER TABLE offers ADD COLUMN IF NOT EXISTS status varchar(16) NOT NULL DEFAULT 'published';
ALTER TABLE offers ADD COLUMN IF NOT EXISTS version integer NOT NULL DEFAULT 1;
ALTER TABLE offers ADD COLUMN IF NOT EXISTS updated_by uuid;

ALTER TABLE insight_posts ADD COLUMN IF NOT EXISTS status varchar(16) NOT NULL DEFAULT 'draft';
ALTER TABLE insight_posts ADD COLUMN IF NOT EXISTS version integer NOT NULL DEFAULT 1;
ALTER TABLE insight_posts ADD COLUMN IF NOT EXISTS updated_by uuid;

ALTER TABLE legal_pages ADD COLUMN IF NOT EXISTS status varchar(16) NOT NULL DEFAULT 'draft';
ALTER TABLE legal_pages ADD COLUMN IF NOT EXISTS version integer NOT NULL DEFAULT 1;
ALTER TABLE legal_pages ADD COLUMN IF NOT EXISTS updated_by uuid;

ALTER TABLE partners ADD COLUMN IF NOT EXISTS status varchar(16) NOT NULL DEFAULT 'published';
ALTER TABLE partners ADD COLUMN IF NOT EXISTS version integer NOT NULL DEFAULT 1;
ALTER TABLE partners ADD COLUMN IF NOT EXISTS updated_by uuid;

CREATE TABLE IF NOT EXISTS content_revisions (
  id uuid PRIMARY KEY,
  entity_type varchar(64) NOT NULL,
  entity_id uuid NOT NULL,
  locale varchar(2) NOT NULL CHECK (locale IN ('pl','en','es')),
  version integer NOT NULL,
  status varchar(16) NOT NULL CHECK (status IN ('draft','review','published','archived')),
  payload jsonb NOT NULL,
  created_by uuid,
  note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  published_at timestamptz
);
CREATE UNIQUE INDEX IF NOT EXISTS content_revisions_entity_version_unique ON content_revisions(entity_type, entity_id, version);
CREATE INDEX IF NOT EXISTS content_revisions_entity_idx ON content_revisions(entity_type, entity_id);

CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY,
  slug varchar(160) NOT NULL,
  locale varchar(2) NOT NULL CHECK (locale IN ('pl','en','es')),
  title text NOT NULL,
  category varchar(64) NOT NULL DEFAULT 'other',
  excerpt text NOT NULL,
  content text NOT NULL,
  starts_at timestamptz NOT NULL,
  ends_at timestamptz,
  venue text,
  capacity integer,
  price text,
  status varchar(16) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','review','published','archived')),
  version integer NOT NULL DEFAULT 1,
  updated_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS events_slug_locale_unique ON events(slug, locale);
CREATE INDEX IF NOT EXISTS events_starts_idx ON events(starts_at);
CREATE INDEX IF NOT EXISTS events_locale_idx ON events(locale);

CREATE TABLE IF NOT EXISTS requests (
  id uuid PRIMARY KEY,
  kind varchar(32) NOT NULL DEFAULT 'contact',
  name text NOT NULL,
  email varchar(254) NOT NULL,
  message text NOT NULL,
  locale varchar(2) NOT NULL DEFAULT 'pl' CHECK (locale IN ('pl','en','es')),
  consent boolean NOT NULL,
  consent_version varchar(32) NOT NULL,
  consent_at timestamptz NOT NULL,
  offer_slug varchar(160),
  event_id uuid,
  status varchar(32) NOT NULL DEFAULT 'new',
  notification_status varchar(32) NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS requests_email_idx ON requests(email);
CREATE INDEX IF NOT EXISTS requests_created_idx ON requests(created_at);
CREATE INDEX IF NOT EXISTS requests_status_idx ON requests(status);

CREATE TABLE IF NOT EXISTS notification_queue (
  id uuid PRIMARY KEY,
  request_id uuid NOT NULL,
  kind varchar(32) NOT NULL,
  recipient varchar(254) NOT NULL,
  subject text NOT NULL,
  body text NOT NULL,
  attempts integer NOT NULL DEFAULT 0,
  available_at timestamptz NOT NULL DEFAULT now(),
  sent_at timestamptz,
  last_error text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS notification_queue_available_idx ON notification_queue(available_at);
CREATE INDEX IF NOT EXISTS notification_queue_request_idx ON notification_queue(request_id);
