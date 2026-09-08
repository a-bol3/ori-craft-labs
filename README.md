## Persistence

Production uses a dedicated CockroachDB database through the PostgreSQL wire protocol. PostgreSQL is used for local development and compatibility tests. The application never dual-writes to both engines.

Copy `.env.example` to `.env.local` and set `DATABASE_URL`. For local PostgreSQL:

```bash
docker compose -f docker-compose.db.yml up -d
$env:DATABASE_URL="postgresql://ori:ori_local_only_change_me@127.0.0.1:55432/ori_craft_labs"
npm run db:migrate
npm run db:seed -- --apply
npm run db:verify
```

For CockroachDB, use the TLS connection string supplied by the managed cluster and keep `DATABASE_SSL_MODE=verify-full`. Never commit `.env.local`, production credentials, certificates, or legacy MongoDB credentials.

Database scripts:

```text
npm run db:generate       # generate Drizzle migrations from the schema
npm run db:migrate        # apply versioned migrations
npm run db:seed -- --apply
npm run db:import:mongo   # inventory legacy MongoDB without writing
npm run db:import:mongo -- --apply
npm run db:verify
```

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
