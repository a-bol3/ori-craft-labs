# ORI Craft Labs deployment runbook

This runbook is intentionally non-destructive. It keeps the current containers, volumes and databases available until external smoke tests pass.

## Preflight and backup

1. Confirm SSH access in a second terminal before any firewall or Nginx change.
2. Capture `docker ps -a`, `docker images`, `docker volume ls`, `docker network ls`, `ss -lntup`, `df -h` and `free -h`.
3. Copy `/etc/nginx` and every compose file plus environment file to a timestamped root-only backup directory.
4. Create a VPS snapshot/backup in Hostinger.
5. Confirm `ori-os-web`, `ori-os-api`, `folga-intermediario-hub-web-1`, their databases and the current ORI Craft Labs container are healthy.

## Blue-green release

1. Build `ori-craft-labs:release-<git-sha>` away from the public ports.
2. Run it first on an isolated loopback port with a dedicated `.env.production` containing the exclusive CockroachDB URL and Resend settings. Port `3301` is reserved by the preserved legacy staging container; the current Cockroach candidate used `3303`, the first production blue-green container used `3204`, and the active Resend-enabled container uses `3205`.
3. Verify `/api/health`, `/`, `/en`, `/es`, `/robots.txt`, `/sitemap.xml` and the public form contracts.
4. Verify the other three public hosts before and after the change.
5. Switch the root upstream only after the new healthcheck is green. The current production upstream is `127.0.0.1:3205`; the previous SQL container remains on `127.0.0.1:3204` and the recovered application on `127.0.0.1:3200` for rollback during observation. Normalize to port `3200` only in a later maintenance window after rollback is no longer needed.
6. Install the explicit Nginx blocks from `ops/nginx/ori-craft-labs.conf`, run `nginx -t`, and reload only after it passes.
7. Keep the previous image and backup for rollback.

The current SQL staging instance is intentionally not connected to Nginx. It uses an internal PostgreSQL container only to validate the SQL compatibility layer. Production now uses the dedicated managed CockroachDB URL with TLS and a verified Resend domain; the root upstream was changed to the blue-green container only after external smoke tests passed. The public contact endpoint has returned `emailSent: true` and the active container survived a restart.

## Rollback

Restore the previous compose/env files, switch the root upstream back to the previous local port, run `nginx -t`, reload Nginx, and start the previous container. Do not remove the new image until the observation period is complete.

## Public checks

```bash
for host in ori-craftlabs.com www.ori-craftlabs.com app.ori-craftlabs.com orios.ori-craftlabs.com api.orios.ori-craftlabs.com; do
  curl -I --max-time 10 "https://$host/"
done
curl -fsS https://ori-craftlabs.com/api/health
curl -fsS https://api.orios.ori-craftlabs.com/health
```

The root host must be the only host serving ORI Craft Labs. `www` must return a permanent redirect to the root; no application may redirect to another product host.
