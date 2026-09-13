# ORI Craft Labs deployment runbook

This runbook is deliberately non-destructive. Keep the existing production and rollback containers, images, volumes, and databases until the new release passes external checks and its observation period is accepted.

## Observed VPS state — 2026-09-13

Read-only inspection of the Hostinger VPS showed:

| Role | Container | Loopback port | Observed state |
| --- | --- | ---: | --- |
| Live release | `ori-craftlabs-web-release-afad733` (`ori-craft-labs:release-afad733`) | `3207` | Healthy; Nginx root vhost proxies here |
| Previous release / rollback candidate | `ori-craftlabs-web-sql-production-i18n` | `3206` | Healthy; retain until the current release is accepted |
| SQL staging web app | `ori-craftlabs-sql-staging-web` | `3302` | Running; configured for the separate `ori-craftlabs-staging-db/ori_craftlabs` database |
| Localized-route SQL staging | `ori-craftlabs-localized-staging-9ea8076` | `3305` | Deployed from commit `9ea8076`; isolated staging database; schema verified, but no Insights rows were present for detail-page testing |
| Recovered legacy staging | `ori-craftlabs-recovered-staging` | `3301` | Running; preserve |
| Other candidate/staging services | Various | `3303`, `3306` | In use; preserve |

Ports `3204` and `3205` also had older ORI Craft Labs containers. Confirm the live state again before every deployment; container names and port assignments can change. The checked-in Nginx file is a reference, not proof of the currently loaded configuration. Its other product-host blocks have not been reconciled with the live VPS and must not be installed wholesale without that review.

At the first inspection, `127.0.0.1:3305` had no listener or Docker port mapping. After that inspection, the approved isolated staging deployment used port `3305`; do not infer current availability from the earlier reading. The Hostinger Docker-project inventory endpoint reports that Docker Manager is unsupported for this VM, so re-check containers and listeners through the VPS console before any deployment or port change.

The localized Insights route fix in commit `9ea8076` was deployed to the isolated staging container, not production. Staging returned HTTP 200 for `/pl/insights`, `/en/insights`, `/es/insights`, and `/api/health`; its database had no article rows, so the detail route could not be validated there. No production Nginx/upstream change was made. A public production check on 2026-09-13 found `/en/insights` and `/es/insights` return HTTP 200 but render the localized Packages/Experiences pages with `<html lang="pl">`; the localized Insights fix remains pending production approval and a detail-route test with suitable staging content.

The Hostinger backup inventory for VM `751638` returned two VPS restore points: `51759075` (2026-09-11 16:49 UTC) and `50874798` (2026-09-04 16:13 UTC). These are VPS backups only; they do not establish that CockroachDB is backed up.

The same public check confirmed `/insights`, `/robots.txt`, and `/sitemap.xml` return HTTP 200. `/api/health` returned `status: ok`, `database: ok`, and version `release-afad733`. The public Insights list did not contain `TEST`; the sitemap had six Insights URLs and did not include its slug. An unauthenticated request for its preview URL returned HTTP 404 and did not expose the draft text. **CMS archival is not yet verified.** In the checked-in CMS, the `Delete` action is implemented as a soft archive (`status: archived`), but the current production CMS record was not changed or rechecked during this verification.

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
