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
2. Run it on `127.0.0.1:3301` with a dedicated `.env.production` containing the dedicated MongoDB URI and Resend settings.
3. Verify `/api/health`, `/`, `/en`, `/es`, `/robots.txt`, `/sitemap.xml` and the public form contracts.
4. Verify the other three public hosts before and after the change.
5. Stop only the old ORI Craft Labs container after the new healthcheck is green; bind the new container to `127.0.0.1:3200`.
6. Install the explicit Nginx blocks from `ops/nginx/ori-craft-labs.conf`, run `nginx -t`, and reload only after it passes.
7. Keep the previous image and backup for rollback.

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
