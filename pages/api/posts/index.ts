import type { NextApiRequest, NextApiResponse } from 'next'
import { getMissingAuthConfig, getSessionUser, setNextAuthBaseUrl } from '@/lib/auth'

setNextAuthBaseUrl()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const missingConfig = getMissingAuthConfig()
  if (missingConfig.length > 0) {
    return res.status(500).json({
      error: 'Missing Google OAuth configuration',
      missing: missingConfig,
    })
  }

  if (req.method === 'GET') {
    try {
      const { prisma } = await import('@/lib/db')
      const posts = await prisma.post.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
          author: {
            select: {
              id: true,
              email: true,
              name: true,
              picture: true,
            },
          },
        },
      })

      return res.status(200).json(posts)
    } catch (error) {
      console.error('Error fetching posts:', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }

  if (req.method === 'POST') {
    try {
      const user = await getSessionUser(req, res)
      if (!user?.id) {
        return res.status(401).json({ error: 'Unauthorized' })
      }

      const title = String(req.body?.title || '').trim()
      const content = String(req.body?.content || '').trim()

      if (!title || !content) {
        return res.status(400).json({ error: 'Title and content are required' })
      }

      const { prisma } = await import('@/lib/db')
      const author =
        (await prisma.user.findUnique({
          where: { id: user.id },
          select: { id: true },
        })) ||
        (await prisma.user.findUnique({
          where: { email: user.email },
          select: { id: true },
        }))

      if (!author) {
        return res.status(404).json({ error: 'Author not found' })
      }

      const post = await prisma.post.create({
        data: {
          title,
          content,
          authorId: author.id,
        },
        include: {
          author: {
            select: {
              id: true,
              email: true,
              name: true,
              picture: true,
            },
          },
        },
      })

      return res.status(201).json(post)
    } catch (error) {
      console.error('Error creating post:', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
