import { getServerSession } from 'next-auth/next'
import type { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import type { NextApiRequest, NextApiResponse } from 'next'

function getBaseUrl() {
  return (
    process.env.NEXTAUTH_URL ||
    process.env.APP_BASE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')
  )
}

function getNextAuthSecret() {
  return process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET || ''
}

function getGoogleClientId() {
  return process.env.GOOGLE_CLIENT_ID || process.env.AUTH_GOOGLE_ID || ''
}

function getGoogleClientSecret() {
  return process.env.GOOGLE_CLIENT_SECRET || process.env.AUTH_GOOGLE_SECRET || ''
}

export function setNextAuthBaseUrl() {
  const baseUrl = getBaseUrl()

  if (baseUrl && !process.env.NEXTAUTH_URL) {
    process.env.NEXTAUTH_URL = baseUrl
  }

  return baseUrl
}

export function getMissingAuthConfig() {
  return [
    !getGoogleClientId() && 'GOOGLE_CLIENT_ID (or AUTH_GOOGLE_ID)',
    !getGoogleClientSecret() && 'GOOGLE_CLIENT_SECRET (or AUTH_GOOGLE_SECRET)',
    !getNextAuthSecret() && 'NEXTAUTH_SECRET (or AUTH_SECRET)',
  ].filter(Boolean) as string[]
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: getGoogleClientId(),
      clientSecret: getGoogleClientSecret(),
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  secret: getNextAuthSecret(),
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider !== 'google') {
        return true
      }

      if (!process.env.DATABASE_URL) {
        return true
      }

      const { prisma } = await import('@/lib/db')

      const googleId =
        (profile as { sub?: string } | undefined)?.sub ||
        account.providerAccountId ||
        user.email ||
        user.name

      if (!googleId || !user.email) {
        return true
      }

      await prisma.user.upsert({
        where: { oauthId: googleId },
        update: {
          email: user.email,
          name: user.name,
          picture: user.image,
        },
        create: {
          oauthId: googleId,
          email: user.email,
          name: user.name,
          picture: user.image,
        },
      })

      return true
    },
  },
}

export async function getSessionUser(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions)

  if (!session?.user) {
    return null
  }

  return {
    id: session.user.email || session.user.name || '',
    email: session.user.email || '',
    name: session.user.name,
    picture: session.user.image,
  }
}
