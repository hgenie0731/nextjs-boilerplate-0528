'use client'

import { useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/button'

type PostDraft = {
  title: string
  content: string
}

interface PostComposerProps {
  onCreate: (draft: PostDraft) => Promise<void>
}

export default function PostComposer({ onCreate }: PostComposerProps) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!title.trim() || !content.trim() || submitting) {
      return
    }

    setSubmitting(true)
    try {
      await onCreate({ title: title.trim(), content: content.trim() })
      setTitle('')
      setContent('')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form
      id="write"
      onSubmit={handleSubmit}
      className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-600">
            Write Post
          </p>
          <h3 className="mt-1 text-lg font-bold text-slate-900">새 글 작성</h3>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500">
          로그인 사용자만 작성 가능
        </span>
      </div>

      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            제목
          </label>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="게시글 제목을 입력하세요"
            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-sky-400 focus:bg-white"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            내용
          </label>
          <textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="게시글 내용을 입력하세요"
            rows={7}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-sky-400 focus:bg-white"
          />
        </div>
      </div>

      <div className="mt-5 flex items-center justify-end gap-3">
        <Button
          type="submit"
          className="h-11 rounded-full bg-sky-600 px-5 text-white hover:bg-sky-700"
          disabled={submitting}
        >
          {submitting ? '작성 중...' : '등록하기'}
        </Button>
      </div>
    </form>
  )
}
