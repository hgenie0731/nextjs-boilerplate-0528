import NextAuth from 'next-auth'
import type { NextApiRequest, NextApiResponse } from 'next'
import { authOptions, getMissingAuthConfig, setNextAuthBaseUrl } from '@/lib/auth'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  setNextAuthBaseUrl()

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
