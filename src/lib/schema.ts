import {
  boolean,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
  index,
} from "drizzle-orm/pg-core";

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
};

export const users = pgTable("users", {
  id: uuid("id").primaryKey(), name: text("name").notNull(), email: varchar("email", { length: 254 }).notNull(), passwordHash: text("password_hash").notNull(), role: varchar("role", { length: 32 }).notNull().default("client"), preferredLocale: varchar("preferred_locale", { length: 2 }).notNull().default("pl"), ...timestamps,
}, (t) => ({ emailUnique: uniqueIndex("users_email_unique").on(t.email), roleIndex: index("users_role_idx").on(t.role) }));

export const contactRequests = pgTable("contact_requests", {
  id: uuid("id").primaryKey(), name: text("name").notNull(), email: varchar("email", { length: 254 }).notNull(), subject: text("subject").notNull(), message: text("message").notNull(), consent: boolean("consent").notNull(), consentVersion: varchar("consent_version", { length: 32 }).notNull(), consentAt: timestamp("consent_at", { withTimezone: true }).notNull(), emailSent: boolean("email_sent").notNull().default(false), legacyMongoId: varchar("legacy_mongo_id", { length: 32 }), ...timestamps,
}, (t) => ({ emailIndex: index("contact_requests_email_idx").on(t.email), createdIndex: index("contact_requests_created_idx").on(t.createdAt) }));

export const newsletterSubscribers = pgTable("newsletter_subscribers", {
  id: uuid("id").primaryKey(), email: varchar("email", { length: 254 }).notNull(), consent: boolean("consent").notNull(), consentVersion: varchar("consent_version", { length: 32 }).notNull(), consentAt: timestamp("consent_at", { withTimezone: true }).notNull(), confirmationTokenHash: varchar("confirmation_token_hash", { length: 64 }), confirmationTokenExpiresAt: timestamp("confirmation_token_expires_at", { withTimezone: true }), confirmedAt: timestamp("confirmed_at", { withTimezone: true }), unsubscribedAt: timestamp("unsubscribed_at", { withTimezone: true }), emailSent: boolean("email_sent").notNull().default(false), legacyMongoId: varchar("legacy_mongo_id", { length: 32 }), ...timestamps,
}, (t) => ({ emailUnique: uniqueIndex("newsletter_subscribers_email_unique").on(t.email), tokenIndex: index("newsletter_subscribers_token_idx").on(t.confirmationTokenHash) }));

export const rateLimitBuckets = pgTable("rate_limit_buckets", {
  id: uuid("id").primaryKey(), key: varchar("key", { length: 512 }).notNull(), count: integer("count").notNull().default(0), resetAt: timestamp("reset_at", { withTimezone: true }).notNull(), ...timestamps,
}, (t) => ({ keyUnique: uniqueIndex("rate_limit_buckets_key_unique").on(t.key), resetIndex: index("rate_limit_buckets_reset_idx").on(t.resetAt) }));

export const heroSettings = pgTable("hero_settings", {
  id: uuid("id").primaryKey(), locale: varchar("locale", { length: 2 }).notNull(), titleLine1: text("title_line1").notNull(), titleLine2: text("title_line2").notNull(), subtitle: text("subtitle").notNull(), primaryCtaLabel: text("primary_cta_label").notNull(), primaryCtaHref: text("primary_cta_href").notNull(), secondaryCtaLabel: text("secondary_cta_label").notNull(), secondaryCtaHref: text("secondary_cta_href").notNull(), status: varchar("status", { length: 16 }).notNull().default("published"), version: integer("version").notNull().default(1), updatedBy: uuid("updated_by"), ...timestamps,
}, (t) => ({ localeUnique: uniqueIndex("hero_settings_locale_unique").on(t.locale) }));

export const services = pgTable("services", {
  id: uuid("id").primaryKey(), locale: varchar("locale", { length: 2 }).notNull(), section: varchar("section", { length: 64 }).notNull(), title: text("title").notNull(), subtitle: text("subtitle").notNull(), slug: varchar("slug", { length: 160 }).notNull(), shortDescription: text("short_description").notNull(), valueSummary: text("value_summary").notNull(), priceFrom: text("price_from"), duration: text("duration"), bullets: jsonb("bullets").$type<string[]>().notNull().default([]), isActive: boolean("is_active").notNull().default(true), status: varchar("status", { length: 16 }).notNull().default("published"), version: integer("version").notNull().default(1), updatedBy: uuid("updated_by"), legacyMongoId: varchar("legacy_mongo_id", { length: 32 }), ...timestamps,
}, (t) => ({ slugUnique: uniqueIndex("services_slug_unique").on(t.slug), localeIndex: index("services_locale_idx").on(t.locale) }));

export const offers = pgTable("offers", {
  id: uuid("id").primaryKey(), group: varchar("group_name", { length: 64 }).notNull(), slug: varchar("slug", { length: 160 }).notNull(), locale: varchar("locale", { length: 2 }).notNull(), title: text("title").notNull(), subtitle: text("subtitle"), priceFrom: text("price_from"), duration: text("duration"), includes: jsonb("includes").$type<string[]>().notNull().default([]), value: text("value").notNull(), idealFor: text("ideal_for"), notes: text("notes"), order: integer("sort_order").notNull().default(0), isActive: boolean("is_active").notNull().default(true), status: varchar("status", { length: 16 }).notNull().default("published"), version: integer("version").notNull().default(1), updatedBy: uuid("updated_by"), legacyMongoId: varchar("legacy_mongo_id", { length: 32 }), ...timestamps,
}, (t) => ({ slugUnique: uniqueIndex("offers_slug_unique").on(t.slug), localeIndex: index("offers_locale_idx").on(t.locale) }));

export const insightPosts = pgTable("insight_posts", {
  id: uuid("id").primaryKey(), title: text("title").notNull(), slug: varchar("slug", { length: 160 }).notNull(), category: varchar("category", { length: 64 }).notNull().default("other"), locale: varchar("locale", { length: 2 }).notNull(), excerpt: text("excerpt").notNull(), content: text("content").notNull(), status: varchar("status", { length: 16 }).notNull().default("draft"), version: integer("version").notNull().default(1), publishedAt: timestamp("published_at", { withTimezone: true }), updatedBy: uuid("updated_by"), legacyMongoId: varchar("legacy_mongo_id", { length: 32 }), ...timestamps,
}, (t) => ({ slugUnique: uniqueIndex("insight_posts_slug_unique").on(t.slug), localeIndex: index("insight_posts_locale_idx").on(t.locale), publishedIndex: index("insight_posts_published_idx").on(t.publishedAt) }));

export const legalPages = pgTable("legal_pages", {
  id: uuid("id").primaryKey(), slug: varchar("slug", { length: 64 }).notNull(), locale: varchar("locale", { length: 2 }).notNull(), title: text("title").notNull(), intro: text("intro"), content: text("content").notNull(), lastUpdated: timestamp("last_updated", { withTimezone: true }).notNull().defaultNow(), isActive: boolean("is_active").notNull().default(true), status: varchar("status", { length: 16 }).notNull().default("draft"), version: integer("version").notNull().default(1), updatedBy: uuid("updated_by"), legacyMongoId: varchar("legacy_mongo_id", { length: 32 }), ...timestamps,
}, (t) => ({ slugLocaleUnique: uniqueIndex("legal_pages_slug_locale_unique").on(t.slug, t.locale) }));

export const mediaAssets = pgTable("media_assets", {
  id: uuid("id").primaryKey(), title: text("title").notNull(), slug: varchar("slug", { length: 160 }).notNull(), type: varchar("type", { length: 16 }).notNull(), url: text("url").notNull(), thumbnailUrl: text("thumbnail_url"), alt: text("alt"), tags: jsonb("tags").$type<string[]>().notNull().default([]), section: text("section"), locale: varchar("locale", { length: 2 }).notNull(), order: integer("sort_order").notNull().default(0), isActive: boolean("is_active").notNull().default(true), legacyMongoId: varchar("legacy_mongo_id", { length: 32 }), ...timestamps,
}, (t) => ({ slugUnique: uniqueIndex("media_assets_slug_unique").on(t.slug), localeIndex: index("media_assets_locale_idx").on(t.locale) }));

export const pages = pgTable("pages", {
  id: uuid("id").primaryKey(), pageId: varchar("page_id", { length: 100 }).notNull(), slug: varchar("slug", { length: 160 }).notNull(), locale: varchar("locale", { length: 2 }).notNull(), title: text("title").notNull(), heroTitle: text("hero_title"), heroSubtitle: text("hero_subtitle"), lead: text("lead"), mainContent: text("main_content"), showInNav: boolean("show_in_nav").notNull().default(false), navLabel: text("nav_label"), order: integer("sort_order").notNull().default(0), status: varchar("status", { length: 16 }).notNull().default("draft"), legacyMongoId: varchar("legacy_mongo_id", { length: 32 }), ...timestamps,
}, (t) => ({ slugLocaleUnique: uniqueIndex("pages_slug_locale_unique").on(t.slug, t.locale), pageIdIndex: index("pages_page_id_idx").on(t.pageId) }));

export const partners = pgTable("partners", {
  id: uuid("id").primaryKey(), name: text("name").notNull(), type: varchar("type", { length: 32 }).notNull().default("other"), locale: varchar("locale", { length: 2 }).notNull(), description: text("description").notNull(), websiteUrl: text("website_url"), logoUrl: text("logo_url"), isActive: boolean("is_active").notNull().default(true), status: varchar("status", { length: 16 }).notNull().default("published"), version: integer("version").notNull().default(1), updatedBy: uuid("updated_by"), order: integer("sort_order").notNull().default(0), legacyMongoId: varchar("legacy_mongo_id", { length: 32 }), ...timestamps,
}, (t) => ({ localeIndex: index("partners_locale_idx").on(t.locale) }));

export const auditLogs = pgTable("audit_logs", {
  id: uuid("id").primaryKey(), actorUserId: uuid("actor_user_id"), action: varchar("action", { length: 120 }).notNull(), entity: varchar("entity", { length: 120 }).notNull(), entityId: uuid("entity_id"), metadata: jsonb("metadata").$type<Record<string, unknown>>().notNull().default({}), createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => ({ actorIndex: index("audit_logs_actor_idx").on(t.actorUserId), createdIndex: index("audit_logs_created_idx").on(t.createdAt) }));

export const events = pgTable("events", {
  id: uuid("id").primaryKey(),
  slug: varchar("slug", { length: 160 }).notNull(),
  locale: varchar("locale", { length: 2 }).notNull(),
  title: text("title").notNull(),
  category: varchar("category", { length: 64 }).notNull().default("other"),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  startsAt: timestamp("starts_at", { withTimezone: true }).notNull(),
  endsAt: timestamp("ends_at", { withTimezone: true }),
  venue: text("venue"),
  capacity: integer("capacity"),
  price: text("price"),
  status: varchar("status", { length: 16 }).notNull().default("draft"),
  version: integer("version").notNull().default(1),
  updatedBy: uuid("updated_by"),
  ...timestamps,
}, (t) => ({
  slugLocaleUnique: uniqueIndex("events_slug_locale_unique").on(t.slug, t.locale),
  startsIndex: index("events_starts_idx").on(t.startsAt),
  localeIndex: index("events_locale_idx").on(t.locale),
}));

export const requests = pgTable("requests", {
  id: uuid("id").primaryKey(),
  kind: varchar("kind", { length: 32 }).notNull().default("contact"),
  name: text("name").notNull(),
  email: varchar("email", { length: 254 }).notNull(),
  message: text("message").notNull(),
  locale: varchar("locale", { length: 2 }).notNull().default("pl"),
  consent: boolean("consent").notNull(),
  consentVersion: varchar("consent_version", { length: 32 }).notNull(),
  consentAt: timestamp("consent_at", { withTimezone: true }).notNull(),
  offerSlug: varchar("offer_slug", { length: 160 }),
  eventId: uuid("event_id"),
  status: varchar("status", { length: 32 }).notNull().default("new"),
  notificationStatus: varchar("notification_status", { length: 32 }).notNull().default("pending"),
  ...timestamps,
}, (t) => ({
  emailIndex: index("requests_email_idx").on(t.email),
  createdIndex: index("requests_created_idx").on(t.createdAt),
  statusIndex: index("requests_status_idx").on(t.status),
}));

export const notificationQueue = pgTable("notification_queue", {
  id: uuid("id").primaryKey(),
  requestId: uuid("request_id").notNull(),
  kind: varchar("kind", { length: 32 }).notNull(),
  recipient: varchar("recipient", { length: 254 }).notNull(),
  subject: text("subject").notNull(),
  body: text("body").notNull(),
  attempts: integer("attempts").notNull().default(0),
  availableAt: timestamp("available_at", { withTimezone: true }).notNull().defaultNow(),
  sentAt: timestamp("sent_at", { withTimezone: true }),
  lastError: text("last_error"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => ({
  availableIndex: index("notification_queue_available_idx").on(t.availableAt),
  requestIndex: index("notification_queue_request_idx").on(t.requestId),
}));

export const contentRevisions = pgTable("content_revisions", {
  id: uuid("id").primaryKey(),
  entityType: varchar("entity_type", { length: 64 }).notNull(),
  entityId: uuid("entity_id").notNull(),
  locale: varchar("locale", { length: 2 }).notNull(),
  version: integer("version").notNull(),
  status: varchar("status", { length: 16 }).notNull(),
  payload: jsonb("payload").$type<Record<string, unknown>>().notNull(),
  createdBy: uuid("created_by"),
  note: text("note"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  publishedAt: timestamp("published_at", { withTimezone: true }),
}, (t) => ({
  entityVersionUnique: uniqueIndex("content_revisions_entity_version_unique").on(t.entityType, t.entityId, t.version),
  entityIndex: index("content_revisions_entity_idx").on(t.entityType, t.entityId),
}));

export const sqlTables = { users, contactRequests, newsletterSubscribers, rateLimitBuckets, heroSettings, services, offers, insightPosts, legalPages, mediaAssets, pages, partners, auditLogs, events, requests, notificationQueue, contentRevisions };
