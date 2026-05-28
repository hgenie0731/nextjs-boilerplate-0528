import Link from 'next/link'
import type { Post } from '@/lib/types'

interface PostCardProps {
  post: Post
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('ko-KR', {
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(value))
}

function excerpt(content: string) {
  return content.length > 110 ? `${content.slice(0, 110)}...` : content
}

export default function PostCard({ post }: PostCardProps) {
  const authorName = post.author?.name || post.author?.email || '익명'

  return (
    <Link
      href={`/posts/${post.id}`}
      className="group block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold text-slate-900 transition group-hover:text-sky-700">
            {post.title}
          </h3>
          <p className="mt-2 max-h-14 overflow-hidden text-sm leading-6 text-slate-600">
            {excerpt(post.content)}
          </p>
        </div>

        <div className="shrink-0 rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700">
          {formatDate(post.createdAt)}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-dashed border-slate-200 pt-4 text-sm text-slate-500">
        <span>{authorName}</span>
        <span>읽기</span>
      </div>
    </Link>
  )
}
