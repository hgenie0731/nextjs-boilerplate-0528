import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch('/api/user')
        if (response.ok) {
          router.push('/dashboard')
        }
      } catch (error) {
        // User not authenticated, stay on login page
      }
    }

    checkAuth()
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Welcome</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground mb-6">
            Sign in to your account using Google
          </p>
          <Link href="/api/auth/login">
            <Button className="w-full">Sign in with Google</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
