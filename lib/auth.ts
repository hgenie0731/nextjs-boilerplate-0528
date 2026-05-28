import { getServerSession } from 'next-auth/next'
import type { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import type { NextApiRequest, NextApiResponse } from 'next'

function getRequestBaseUrl(req?: NextApiRequest) {
  const forwardedHost = req?.headers['x-forwarded-host']
  const hostHeader = req?.headers.host
  const host = Array.isArray(forwardedHost)
    ? forwardedHost[0]
    : forwardedHost || hostHeader

  if (host) {
    const forwardedProto = req?.headers['x-forwarded-proto']
    const proto = Array.isArray(forwardedProto)
      ? forwardedProto[0]
      : forwardedProto || (host.includes('localhost') ? 'http' : 'https')

    return `${proto}://${host}`
  }

  return null
}

function getBaseUrl(req?: NextApiRequest) {
  return (
    getRequestBaseUrl(req) ||
    process.env.APP_BASE_URL ||
    process.env.NEXTAUTH_URL ||
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

export function setNextAuthBaseUrl(req?: NextApiRequest) {
  const baseUrl = getBaseUrl(req)

  if (baseUrl && process.env.NEXTAUTH_URL !== baseUrl) {
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
    async jwt({ token, user }) {
      const tokenWithUserId = token as typeof token & {
        userId?: string
        email?: string | null
      }

      if (user?.email && process.env.DATABASE_URL) {
        const { prisma } = await import('@/lib/db')
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email },
          select: { id: true },
        })
        tokenWithUserId.userId =
          dbUser?.id || tokenWithUserId.userId || user.email
        return tokenWithUserId
      }

      if (!tokenWithUserId.userId && tokenWithUserId.email && process.env.DATABASE_URL) {
        const { prisma } = await import('@/lib/db')
        const dbUser = await prisma.user.findUnique({
          where: { email: tokenWithUserId.email },
          select: { id: true },
        })
        tokenWithUserId.userId = dbUser?.id || tokenWithUserId.email
      }

      return tokenWithUserId
    },
    async session({ session, token }) {
      const sessionWithId = session as typeof session & {
        user: typeof session.user & { id?: string }
      }
      const tokenWithUserId = token as typeof token & { userId?: string }

      if (sessionWithId.user) {
        sessionWithId.user.id = String(
          tokenWithUserId.userId || session.user?.email || ''
        )
      }

      return sessionWithId
    },
  },
}

export async function getSessionUser(
  req: NextApiRequest,
  res: NextApiResponse
) {
  setNextAuthBaseUrl(req)

  const session = await getServerSession(req, res, authOptions)

  if (!session?.user) {
    return null
  }

  const sessionUser = session.user as {
    id?: string
    email?: string | null
    name?: string | null
    image?: string | null
  }

  return {
    id: sessionUser.id || sessionUser.email || sessionUser.name || '',
    email: sessionUser.email || '',
    name: sessionUser.name || undefined,
    picture: sessionUser.image || undefined,
  }
}
