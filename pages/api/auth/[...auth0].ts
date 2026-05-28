import { handleAuth, handleLogin, handleCallback } from '@auth0/nextjs-auth0'
import { NextApiRequest, NextApiResponse } from 'next'

// Support both the current Auth0 env names and the legacy names used in the docs.
// This keeps deployed environments working while we migrate configuration.
const auth0Domain =
  process.env.AUTH0_DOMAIN ||
  process.env.AUTH0_ISSUER_BASE_URL?.replace(/^https?:\/\//, '')

const appBaseUrl =
  process.env.APP_BASE_URL ||
  process.env.AUTH0_BASE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined)

if (auth0Domain && !process.env.AUTH0_DOMAIN) {
  process.env.AUTH0_DOMAIN = auth0Domain
}

if (appBaseUrl && !process.env.APP_BASE_URL) {
  process.env.APP_BASE_URL = appBaseUrl
}

if (appBaseUrl && !process.env.AUTH0_BASE_URL) {
  process.env.AUTH0_BASE_URL = appBaseUrl
}

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

export default handleAuth({
  async callback(req: NextApiRequest, res: NextApiResponse) {
    try {
      await handleCallback(req, res, { afterCallback })
    } catch (error) {
      res.status(error instanceof Error ? 500 : 400).end(error)
    }
  },
})
