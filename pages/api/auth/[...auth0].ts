import { handleAuth, handleLogin, handleCallback } from '@auth0/nextjs-auth0'
import { NextApiRequest, NextApiResponse } from 'next'

// Normalize Auth0 env names so older docs, local dev, and Vercel previews all work.
const auth0IssuerBaseUrl =
  process.env.AUTH0_ISSUER_BASE_URL ||
  (process.env.AUTH0_DOMAIN
    ? `https://${process.env.AUTH0_DOMAIN.replace(/^https?:\/\//, '')}`
    : undefined)

const auth0Secret = process.env.AUTH0_SECRET || process.env.AUTH_SECRET
const auth0ClientId = process.env.AUTH0_CLIENT_ID || process.env.AUTH_GOOGLE_ID
const auth0ClientSecret =
  process.env.AUTH0_CLIENT_SECRET || process.env.AUTH_GOOGLE_SECRET

const appBaseUrl =
  process.env.APP_BASE_URL ||
  process.env.AUTH0_BASE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined)

if (auth0IssuerBaseUrl && !process.env.AUTH0_ISSUER_BASE_URL) {
  process.env.AUTH0_ISSUER_BASE_URL = auth0IssuerBaseUrl
}

if (auth0Secret && !process.env.AUTH0_SECRET) {
  process.env.AUTH0_SECRET = auth0Secret
}

if (auth0ClientId && !process.env.AUTH0_CLIENT_ID) {
  process.env.AUTH0_CLIENT_ID = auth0ClientId
}

if (auth0ClientSecret && !process.env.AUTH0_CLIENT_SECRET) {
  process.env.AUTH0_CLIENT_SECRET = auth0ClientSecret
}

if (appBaseUrl && !process.env.APP_BASE_URL) {
  process.env.APP_BASE_URL = appBaseUrl
}

if (appBaseUrl && !process.env.AUTH0_BASE_URL) {
  process.env.AUTH0_BASE_URL = appBaseUrl
}

const missingConfig = [
  !process.env.AUTH0_ISSUER_BASE_URL && 'AUTH0_ISSUER_BASE_URL (or AUTH0_DOMAIN)',
  !process.env.AUTH0_CLIENT_ID && 'AUTH0_CLIENT_ID (or AUTH_GOOGLE_ID)',
  !process.env.AUTH0_CLIENT_SECRET && 'AUTH0_CLIENT_SECRET (or AUTH_GOOGLE_SECRET)',
  !process.env.AUTH0_SECRET && 'AUTH0_SECRET (or AUTH_SECRET)',
].filter(Boolean)

const afterCallback = async (session: any, _state: any) => {
  try {
    // Persist the user only when a database connection is configured.
    // This keeps login working even when DB env vars are missing in preview/production.
    if (process.env.DATABASE_URL) {
      const { prisma } = await import('../../../lib/db')

      const user = await prisma.user.upsert({
        where: { auth0Id: session.user.sub },
        update: {
          name: session.user.name,
          picture: session.user.picture,
        },
        create: {
          auth0Id: session.user.sub,
          email: session.user.email,
          name: session.user.name,
          picture: session.user.picture,
        },
      })

      session.user.dbId = user.id
    }
  } catch (error) {
    console.error('Error in afterCallback:', error)
  }

  return session
}

const authHandler = handleAuth({
  async callback(req: NextApiRequest, res: NextApiResponse) {
    try {
      await handleCallback(req, res, { afterCallback })
    } catch (error) {
      res.status(error instanceof Error ? 500 : 400).end(error)
    }
  },
})

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (missingConfig.length > 0) {
    res.status(500).json({
      error: 'Missing Auth0 configuration',
      missing: missingConfig,
    })
    return
  }

  return authHandler(req, res)
}
