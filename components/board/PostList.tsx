import type { Post } from '@/lib/types'
import PostCard from './PostCard'

interface PostListProps {
  posts: Post[]
}

export default function PostList({ posts }: PostListProps) {
  if (posts.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-10 text-center shadow-sm">
        <p className="text-sm font-medium text-slate-500">
          아직 첫 글이 없어요.
        </p>
        <p className="mt-2 text-sm text-slate-400">
          오른쪽 아래 글쓰기 영역에서 첫 게시글을 남겨보세요.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  )
}
