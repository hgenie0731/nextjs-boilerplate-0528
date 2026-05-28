import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import ProtectedRoute from '@/components/ProtectedRoute'
import { Button } from '@/components/ui/button'
import type { Post } from '@/lib/types'

export default function PostDetailPage() {
  const router = useRouter()
  const { id } = router.query
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (typeof id !== 'string') {
      setLoading(false)
      return
    }

    async function loadPost() {
      try {
        const response = await fetch(`/api/posts/${id}`)
        if (!response.ok) {
          router.push('/dashboard')
          return
        }
        const data = await response.json()
        setPost(data)
      } catch (error) {
        console.error('Failed to load post:', error)
        router.push('/dashboard')
      } finally {
        setLoading(false)
      }
    }

    loadPost()
  }, [id, router])

  return (
    <ProtectedRoute>
      <div className="mx-auto max-w-4xl">
        <div className="mb-4 flex items-center justify-between">
          <Link href="/dashboard" className="text-sm font-medium text-sky-700">
            ← 게시판으로 돌아가기
          </Link>
          <Button
            asChild
            className="rounded-full bg-sky-600 text-white hover:bg-sky-700"
          >
            <Link href="/dashboard#write">글쓰기</Link>
          </Button>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
          {loading || !post ? (
            <div className="p-10 text-sm text-slate-500">불러오는 중...</div>
          ) : (
            <article className="p-8 md:p-10">
              <div className="mb-6 border-b border-slate-200 pb-6">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-600">
                  Community Post
                </p>
                <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                  {post.title}
                </h1>
                <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                  <span>{post.author?.name || post.author?.email || '익명'}</span>
                  <span>·</span>
                  <span>{new Date(post.createdAt).toLocaleString('ko-KR')}</span>
                </div>
              </div>

              <div className="whitespace-pre-wrap text-base leading-8 text-slate-700">
                {post.content}
              </div>
            </article>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}
