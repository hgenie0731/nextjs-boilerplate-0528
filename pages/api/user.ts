import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from '@auth0/nextjs-auth0'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const session = await getSession(req, res)

    if (!session || !session.user) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    // If a database is configured, return the persisted profile.
    // Otherwise, fall back to the Auth0 session so login still works.
    if (process.env.DATABASE_URL) {
      try {
        const { prisma } = await import('../../lib/db')

        const user = await prisma.user.findUnique({
          where: { auth0Id: session.user.sub },
          select: {
            id: true,
            email: true,
            name: true,
            picture: true,
          },
        })

        if (user) {
          return res.status(200).json(user)
        }
      } catch (dbError) {
        console.error('Error reading user from database:', dbError)
      }
    }

    return res.status(200).json({
      id: session.user.sub,
      email: session.user.email || '',
      name: session.user.name,
      picture: session.user.picture,
    })
  } catch (error) {
    console.error('Error fetching user:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
