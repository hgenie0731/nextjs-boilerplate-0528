import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { signIn, useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

export default function Home() {
  const router = useRouter()
  const { status } = useSession()

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard')
    }
  }, [router, status])

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-5xl items-center px-4 py-10">
      <div className="grid w-full gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-600">
            Community Board
          </p>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
            로그인하고
            <br />
            바로 글을 써보세요.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-slate-600">
            네이버 카페처럼 편안한 분위기의 게시판입니다. Google 로그인만
            하면 글쓰기, 글 읽기, 게시판 탐색을 바로 시작할 수 있어요.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              className="rounded-full bg-sky-600 px-6 text-white hover:bg-sky-700"
              onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
            >
              Google로 로그인
            </Button>
          </div>
        </section>

        <Card className="overflow-hidden rounded-[2rem] border-slate-200 shadow-sm">
          <CardHeader className="bg-gradient-to-br from-sky-50 via-white to-emerald-50">
            <CardTitle className="text-xl text-slate-900">오늘의 게시판</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            {[
              ['공지', '로그인한 사용자만 글을 작성할 수 있어요.'],
              ['자유', '가볍게 생각을 나누고 질문을 올릴 수 있어요.'],
              ['리뷰', '새 글은 작성 직후 목록과 상세 화면에 반영됩니다.'],
            ].map(([title, desc]) => (
              <div
                key={title}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
              >
                <p className="text-sm font-semibold text-slate-900">{title}</p>
                <p className="mt-1 text-sm leading-6 text-slate-600">{desc}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
