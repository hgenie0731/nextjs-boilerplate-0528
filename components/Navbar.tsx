'use client'

import Link from 'next/link'
import { signIn, signOut, useSession } from 'next-auth/react'
import { Button } from './ui/button'

export default function Navbar() {
  const { data: session, status } = useSession()
  const user = session?.user
  const loading = status === 'loading'

  return (
    <nav className="border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-600 text-sm font-bold text-white">
            B
          </span>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-slate-900">Boilerplate Cafe</p>
            <p className="text-xs text-slate-500">글쓰기 게시판</p>
          </div>
        </Link>
        <div className="flex items-center gap-4">
          {!loading && user ? (
            <>
              <span className="hidden text-sm text-slate-500 md:inline">
                {user.name || user.email || 'Signed in'}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => signOut({ callbackUrl: '/' })}
                className="rounded-full border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              >
                Logout
              </Button>
            </>
          ) : (
            <Button
              size="sm"
              onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
              className="rounded-full bg-sky-600 text-white hover:bg-sky-700"
            >
              Login
            </Button>
          )}
        </div>
      </div>
    </nav>
  )
}
