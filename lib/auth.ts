import { getSession } from '@auth0/nextjs-auth0'
import { SessionUser } from './types'

export async function getSessionUser(): Promise<SessionUser | null> {
  const session = await getSession()
  if (!session || !session.user) {
    return null
  }

  return {
    sub: session.user.sub,
    email: session.user.email || '',
    name: session.user.name,
    picture: session.user.picture,
  }
}

export function getAuth0LoginUrl(): string {
  return `${process.env.APP_BASE_URL || process.env.AUTH0_BASE_URL || ''}/api/auth/login`
}

export function getAuth0LogoutUrl(): string {
  return `${process.env.APP_BASE_URL || process.env.AUTH0_BASE_URL || ''}/api/auth/logout`
}
