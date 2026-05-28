import { NextApiRequest, NextApiResponse } from 'next'
import { getSessionUser, getMissingAuthConfig, setNextAuthBaseUrl } from '@/lib/auth'

setNextAuthBaseUrl()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const missingConfig = getMissingAuthConfig()
  if (missingConfig.length > 0) {
    return res.status(500).json({
      error: 'Missing Google OAuth configuration',
      missing: missingConfig,
    })
  }

  try {
    const user = await getSessionUser(req, res)

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    if (process.env.DATABASE_URL && user.id) {
      try {
        const { prisma } = await import('../../lib/db')
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: {
            id: true,
            email: true,
            name: true,
            picture: true,
            oauthId: true,
          },
        })

        if (dbUser) {
          return res.status(200).json(dbUser)
        }

        const fallbackUser = await prisma.user.findUnique({
          where: { email: user.email },
          select: {
            id: true,
            email: true,
            name: true,
            picture: true,
            oauthId: true,
          },
        })

        if (fallbackUser) {
          return res.status(200).json(fallbackUser)
        }
      } catch (dbError) {
        console.error('Error reading user from database:', dbError)
      }
    }

    return res.status(200).json(user)
  } catch (error) {
    console.error('Error fetching user:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
