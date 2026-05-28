import NextAuth from 'next-auth'
import type { NextApiRequest, NextApiResponse } from 'next'
import { authOptions, getMissingAuthConfig, setNextAuthBaseUrl } from '@/lib/auth'

setNextAuthBaseUrl()

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const missingConfig = getMissingAuthConfig()

  if (missingConfig.length > 0) {
    res.status(500).json({
      error: 'Missing Google OAuth configuration',
      missing: missingConfig,
    })
    return
  }

  return NextAuth(req, res, authOptions)
}
