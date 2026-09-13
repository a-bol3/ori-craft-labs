# Ori Craft Labs database runbook

## Production source of truth

CockroachDB is the only production database for Ori Craft Labs. PostgreSQL is used for local development, staging and compatibility checks. The application does not dual-write.

Required production variables:

```text
DATABASE_URL=postgresql://.../ori_craft_labs?sslmode=verify-full
DATABASE_SSL_MODE=verify-full
DATABASE_SSL_CA=<managed-cluster-ca-certificate-if-required>
DATABASE_SSL_CA_FILE=/run/secrets/cockroach-root.crt
DATABASE_POOL_SIZE=10
DATABASE_CONNECTION_TIMEOUT_MS=5000
DATABASE_STATEMENT_TIMEOUT_MS=10000
```

The CockroachDB cluster must be exclusive to Ori Craft Labs. Do not reuse Ori OS databases, credentials, networks or backups.

For a VPS deployment, prefer `DATABASE_SSL_CA_FILE` over placing the certificate
contents in the environment. The CA is mounted read-only into the web
container; the connection string remains in a mode-600 environment file and is
never committed to the repository.

## Migration order

```bash
npm run db:migrate
npm run db:verify
npm run db:seed -- --apply
npm run db:import:mongo
npm run db:import:mongo -- --apply
```

The MongoDB import is read-only unless `--apply` is supplied. It requires `LEGACY_MONGODB_URI` and `LEGACY_MONGODB_DB_NAME`, and is never part of the running web image.

## Production cutover checklist

1. Confirm CockroachDB connection using a migration-only credential.
2. Apply migrations and verify all expected tables.
3. Run the seed; confirm it is idempotent.
4. Inspect any MongoDB inventory and approve records before importing.
5. Bootstrap the first admin once, with a temporary password supplied out-of-band.
6. Verify `/api/health`, contact persistence, newsletter persistence and login.
7. Rotate or remove migration credentials after deployment.
8. Keep the legacy MongoDB backup untouched during the observation period.

Create a separate database for staging before running any staging migration or
seed. Never reuse the production database URL for a staging container:

```bash
TARGET_DATABASE=ori_craftlabs_staging npm run db:provision
```

## Editorial workflow

The migration user applies schema changes. After each additive migration, grant
the runtime role only the CRUD permissions it needs on newly created tables:

```bash
APP_DB_ROLE=ori_craftlabs_app npm run db:grant-app
```

The script validates the role identifier and never prints the database URL or
password.

The editorial migration is additive. Existing records remain available while
the CMS gains `draft`, `review`, `published` and `archived` states. Each
explicit publication creates a row in `content_revisions`. Event requests are
stored in `requests`, and email delivery is tracked in `notification_queue` so
publishing content never sends or duplicates a customer notification.

## Recovery

CockroachDB backups and exports are required in addition to its internal replication. Test restoration into a separate database before production cutover. A VPS backup alone does not protect a managed database, and a database backup alone does not keep the web application available if the VPS fails.

### Production backup verification status — 2026-09-13

CockroachDB Cloud's **Backup and Restore** page for cluster
`oricraftlabs-production` shows complete managed backups, including the
2026-09-12 00:00 UTC snapshot (29 days remaining); the adjacent daily snapshot
was also visible during inspection. The page reports 30-day retention. The
cluster is on the Basic plan, whose UI says backup frequency (RPO) and retention
cannot be configured without upgrading. The Hostinger restore points for VPS
`751638` (2026-09-11 and 2026-09-04 UTC) protect only the VM disk and are not
CockroachDB backups.

**Restore drill remains incomplete.** The CockroachDB restore wizard for this
backup offered only `oricraftlabs-production` as a compatible destination and
described the operation as a cluster restore. The wizard was cancelled before
any restore was initiated, to avoid overwriting production. The Databases page
shows an existing `ori_craftlabs_staging` database, but the restore wizard does
not offer database-level restore into it. Before production sign-off, arrange a
safe, isolated restore target using a supported CockroachDB procedure (for
example, a separately provisioned compatible cluster if required), then run
`npm run db:verify` against the restored data. Do not restore over production,
and do not put connection strings or credentials in this record.
