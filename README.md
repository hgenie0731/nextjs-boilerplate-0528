# Next.js Boilerplate

Next.js 14, Tailwind CSS, shadcn/ui, Google OAuth, and Prisma for MongoDB.

## Tech Stack

- Next.js 14 (Pages Router)
- React 18
- TypeScript
- Tailwind CSS + shadcn/ui
- NextAuth.js with Google OAuth
- Prisma + MongoDB

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

# Optional if you want to persist users in MongoDB
DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/database
```

3. Push Prisma schema if using MongoDB sync

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
- `DATABASE_URL` if you want user sync

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
