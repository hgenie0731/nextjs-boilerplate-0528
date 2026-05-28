# Next.js Boilerplate

Next.js 14, Tailwind CSS, shadcn/ui, Google OAuth, and Prisma for Neon/Postgres.

## Tech Stack

- Next.js 14 (Pages Router)
- React 18
- TypeScript
- Tailwind CSS + shadcn/ui
- NextAuth.js with Google OAuth
- Prisma + PostgreSQL (Neon direct connection)

## Quick Start

1. Install dependencies

```bash
npm install
```

2. Configure environment variables

Create `.env.local` and set:

```bash
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3000

# Neon PostgreSQL direct connection string
DATABASE_URL=postgresql://username:password@ep-example.neon.tech/neondb?sslmode=require
```

3. Push Prisma schema to Postgres

```bash
npx prisma db push
```

4. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Vercel Setup

Add the same environment variables in Vercel:

- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `DATABASE_URL` with your Neon direct connection string

If you already have the older env names locally, they still work:

- `AUTH_GOOGLE_ID` as an alias for `GOOGLE_CLIENT_ID`
- `AUTH_GOOGLE_SECRET` as an alias for `GOOGLE_CLIENT_SECRET`
- `AUTH_SECRET` as an alias for `NEXTAUTH_SECRET`

Google OAuth must also allow these redirect URIs:

- `http://localhost:3000/api/auth/callback/google`
- `https://<your-vercel-deployment-domain>/api/auth/callback/google`

## Authentication Flow

- Home page shows a Google sign-in button
- NextAuth handles `/api/auth/signin`, `/api/auth/callback`, and `/api/auth/signout`
- `/api/user` returns the current signed-in user
- `/dashboard` is shown after sign-in

## Useful Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

```bash
npx prisma db push
npx prisma studio
```
