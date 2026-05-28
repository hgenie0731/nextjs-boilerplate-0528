'use client'

import Link from 'next/link'
import { signIn, signOut, useSession } from 'next-auth/react'
import { Button } from './ui/button'

export default function Navbar() {
  const { data: session, status } = useSession()
  const user = session?.user
  const loading = status === 'loading'

  return (
    <nav className="border-b border-border bg-card">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="font-bold text-lg">
          Boilerplate
        </Link>
        <div className="flex items-center gap-4">
          {!loading && user ? (
            <>
              <span className="text-sm text-muted-foreground">
                {user.name || user.email || 'Signed in'}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => signOut({ callbackUrl: '/' })}
              >
                Logout
              </Button>
            </>
          ) : (
            <Button size="sm" onClick={() => signIn('google')}>
              Login
            </Button>
          )}
        </div>
      </div>
    </nav>
  )
}
