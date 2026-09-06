# ORI Craft Labs — evidence consolidation

## Canonical recovered source

This working copy was reconstructed from the Google Drive folder `ori-craft-labs` on 2026-09-06. It contains 104 source and asset files, excluding generated `node_modules`, `.next`, and `.git` content.

The application is running locally at `http://localhost:3300`.

## Sources found

- Google Drive: complete Next.js application with public site, admin dashboard, authentication, MongoDB models, API routes, legal pages, newsletter and contact flows.
- Antigravity profile: 108 ORI-related history indexes and 234 historical file revisions across two workspace families:
  - `oricraftlabs-antigravity-1`: multilingual public website, CMS, auth, API, models and deployment work.
  - `oricraftlabs-antigravity-2/oricraftlabs`: localized Next.js application, legal pages, Docker, database layer and production configuration.
- GitHub repositories: treated as historical/incomplete references only; no destructive action is authorized until the canonical repository is rebuilt and verified.

## Current technical blockers

1. Next.js 16 route-handler compatibility was corrected for dynamic `params` in the admin insights and users endpoints.
2. Production build reaches static generation but fails when `/insights` attempts to connect to an obsolete MongoDB hostname from `.env.local`.
3. `.env.local` is retained only for forensic comparison and must not be copied to production without secret rotation and explicit variable review.
4. ESLint configuration needs a proper TypeScript/TSX parser configuration.

## Consolidation rule

The Google Drive application is the canonical product base. Antigravity history is an evidence and recovery source for missing translations, content, components, deployment configuration and feature improvements. Nothing from Antigravity should overwrite the canonical copy blindly; every candidate must be compared, tested and merged intentionally.

## Next decision gate

Before changing GitHub or the VPS: complete the production-readiness plan, repair build-time database coupling, define the persistence/email/anti-spam strategy, rotate secrets, add CI and tests, then stage the canonical app on an isolated port.
