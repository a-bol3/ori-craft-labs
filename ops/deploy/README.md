# ORI Craft Labs deployment runbook

This runbook is deliberately non-destructive. Keep the existing production and rollback containers, images, volumes, and databases until the new release passes external checks and its observation period is accepted.

## Observed VPS state — 2026-09-13

Read-only inspection of the Hostinger VPS showed:

| Role | Container | Loopback port | Observed state |
| --- | --- | ---: | --- |
| Live release | `ori-craftlabs-web-release-afad733` (`ori-craft-labs:release-afad733`) | `3207` | Healthy; Nginx root vhost proxies here |
| Previous release / rollback candidate | `ori-craftlabs-web-sql-production-i18n` | `3206` | Healthy; retain until the current release is accepted |
| SQL staging web app | `ori-craftlabs-sql-staging-web` | `3302` | Running; configured for the separate `ori-craftlabs-staging-db/ori_craftlabs` database |
| Recovered legacy staging | `ori-craftlabs-recovered-staging` | `3301` | Running; preserve |
| Other candidate/staging services | Various | `3303`, `3306` | In use; preserve |

Ports `3204` and `3205` also had older ORI Craft Labs containers. Confirm the live state again before every deployment; container names and port assignments can change. The checked-in Nginx file is a reference, not proof of the currently loaded configuration. Its other product-host blocks have not been reconciled with the live VPS and must not be installed wholesale without that review.

At this inspection, `127.0.0.1:3305` had no listener and no Docker port mapping; recheck immediately before using it. The current deployed release answers `/en/insights` and `/es/insights` with HTTP 200 but returns the localized Packages/Experiences page titles instead of Insights. The locale-aware Insights route fix is still only in the local working tree and has not been deployed.

## Before a deployment

1. Confirm SSH or the Hostinger web console can read the VPS before changing firewall or Nginx settings.
2. Record `docker ps -a`, `docker image ls`, `docker volume ls`, `docker network ls`, `ss -lntup`, `df -h`, and `free -h`.
3. Identify the exact compose/run configuration and environment-file paths. Do not print or copy secret values into logs or chat.
4. Verify staging and production database identities without exposing credentials. Never run migrations, seed, or imports against production as part of staging verification.
5. Confirm the managed CockroachDB backup schedule, retention, and last successful backup separately from any VPS snapshot. A VPS snapshot is not a database backup.
6. Preserve a VPS snapshot and the current image/container configuration before a production cutover.

## Blue-green release

1. Build an immutable image tagged with the reviewed commit SHA, away from all occupied ports.
2. Run it on a newly verified, unused loopback-only port with the intended environment configuration. Do not assume a port is free from this historical table; check `docker ps` and `ss -lntup` immediately beforehand.
3. Verify the health endpoint, `/`, `/pl`, `/en`, `/es`, localized Insights list and detail routes, preview behavior, sitemap, robots, and form contracts against the staging database.
4. Exercise a valid contact/newsletter submission in staging and verify persistence and delivery without using production customer data.
5. Check all other public hosts before and after the change. The root Nginx vhost must proxy only to the selected ORI Craft Labs release; `www` must redirect permanently to the root host.
6. Change only the reviewed ORI Craft Labs root upstream after staging acceptance and a production backup/snapshot. Run `nginx -t` before reloading Nginx.
7. Verify the public site, forms, routes, redirects, and health endpoint externally. Keep the previous release available throughout the agreed observation period.
8. Roll back by restoring the previous upstream and restarting the preserved previous container. Do not remove old images or containers until rollback is no longer required.

No deployment or Nginx change is authorized by this runbook alone. Confirm the exact target and operation before changing the VPS.

## Public checks

```bash
for host in ori-craftlabs.com www.ori-craftlabs.com app.ori-craftlabs.com orios.ori-craftlabs.com api.orios.ori-craftlabs.com; do
  curl -I --max-time 10 "https://$host/"
done
curl -fsS https://ori-craftlabs.com/api/health
curl -fsS https://api.orios.ori-craftlabs.com/health
```

Review the current DNS, Nginx server blocks, and ownership of each host before treating every URL above as an ORI Craft Labs application endpoint. Do not change another product's vhost as part of this release.
