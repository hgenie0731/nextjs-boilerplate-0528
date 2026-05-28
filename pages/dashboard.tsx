import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import ProtectedRoute from '@/components/ProtectedRoute'
import { Button } from '@/components/ui/button'
import PostComposer from '@/components/board/PostComposer'
import PostList from '@/components/board/PostList'
import type { Post, SessionUser } from '@/lib/types'

interface DashboardUser extends SessionUser {
  oauthId?: string
}

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<DashboardUser | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function loadBoard() {
      try {
        const [userResponse, postsResponse] = await Promise.all([
          fetch('/api/user'),
          fetch('/api/posts'),
        ])

        if (!userResponse.ok) {
          router.push('/')
          return
        }

        if (!postsResponse.ok) {
          throw new Error('Failed to load posts')
        }

        const [userData, postsData] = await Promise.all([
          userResponse.json(),
          postsResponse.json(),
        ])

        setUser(userData)
        setPosts(postsData)
      } catch (error) {
        console.error('Failed to load board:', error)
        router.push('/')
      } finally {
        setLoading(false)
      }
    }

    loadBoard()
  }, [router])

  const stats = useMemo(
    () => [
      { label: '게시글', value: posts.length },
      { label: '오늘의 글', value: posts.filter((post) => isToday(post.createdAt)).length },
      { label: '내 글쓰기', value: user ? '가능' : '-' },
    ],
    [posts, user]
  )

  const handleCreatePost = async (draft: { title: string; content: string }) => {
    setSaving(true)
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(draft),
      })

      if (!response.ok) {
        throw new Error('Failed to create post')
      }

      const createdPost = await response.json()
      setPosts((current) => [createdPost, ...current])
      router.push(`/posts/${createdPost.id}`)
    } catch (error) {
      console.error('Failed to create post:', error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <ProtectedRoute>
      <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="space-y-6">
          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="bg-gradient-to-br from-sky-50 via-white to-emerald-50 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-600">
                Cafe Board
              </p>
              <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900">
                네이버 카페 느낌의 게시판
              </h1>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                로그인한 사용자만 글을 쓰고, 바로 글 상세로 이동할 수 있어요.
              </p>
            </div>

            <div className="grid grid-cols-3 border-t border-slate-200 bg-slate-50 text-center">
              {stats.map((item) => (
                <div key={item.label} className="px-3 py-4">
                  <p className="text-lg font-bold text-slate-900">{item.value}</p>
                  <p className="mt-1 text-xs text-slate-500">{item.label}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-sky-100 text-lg font-bold text-sky-700">
                {user?.picture ? (
                  <Image
                    src={user.picture}
                    alt={user.name || user.email}
                    width={56}
                    height={56}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  (user?.name || user?.email || 'G')[0]?.toUpperCase()
                )}
              </div>
              <div className="min-w-0">
                <p className="truncate text-base font-semibold text-slate-900">
                  {user?.name || '회원'}
                </p>
                <p className="truncate text-sm text-slate-500">{user?.email}</p>
              </div>
            </div>

            <div className="mt-5 space-y-2 text-sm">
              <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                <span className="text-slate-500">내 상태</span>
                <span className="font-medium text-sky-700">로그인됨</span>
              </div>
              <Button
                asChild
                variant="outline"
                className="h-11 w-full rounded-full border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              >
                <a href="#write">글쓰기 바로가기</a>
              </Button>
            </div>
          </section>
        </aside>

        <section className="space-y-6">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-600">
                  Community
                </p>
                <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
                  자유게시판
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  최근 글을 확인하고, 바로 새 글을 남겨보세요.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {['전체', '공지', '자유', '질문'].map((label, index) => (
                  <span
                    key={label}
                    className={`rounded-full px-4 py-2 text-sm font-medium ${
                      index === 0
                        ? 'bg-sky-600 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </section>

          <PostComposer onCreate={handleCreatePost} />

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">최근 게시글</h3>
              <p className="text-sm text-slate-500">
                {saving ? '새 글을 저장하는 중...' : `${posts.length}개`}
              </p>
            </div>

            {loading ? (
              <div className="py-12 text-center text-sm text-slate-500">
                게시판을 불러오는 중...
              </div>
            ) : (
              <PostList posts={posts} />
            )}
          </section>
        </section>
      </div>
    </ProtectedRoute>
  )
}

function isToday(value: string) {
  const postDate = new Date(value)
  const now = new Date()
  return (
    postDate.getFullYear() === now.getFullYear() &&
    postDate.getMonth() === now.getMonth() &&
    postDate.getDate() === now.getDate()
  )
}
