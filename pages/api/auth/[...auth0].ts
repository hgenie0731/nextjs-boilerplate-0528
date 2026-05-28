import { handleAuth, handleLogin, handleCallback } from '@auth0/nextjs-auth0'
import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/db'

const afterCallback = async (session: any, _state: any) => {
  try {
    // Create or update user in database
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
