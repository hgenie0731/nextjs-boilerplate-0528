# Post-Login Board Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the authenticated area into a simple Naver Cafe-style board where signed-in users can write, view, and read posts.

**Architecture:** Keep the existing Pages Router and NextAuth stack. Add a minimal `Post` model in Prisma/Postgres, expose a small posts API for listing and creating posts, and replace the dashboard with a board home that combines a cafe-like sidebar, post list, and write form. Use a single board detail page for reading a post so the experience stays simple and focused.

**Tech Stack:** Next.js 14 Pages Router, NextAuth.js, Prisma, PostgreSQL (Neon), React 18, Tailwind CSS, shadcn/ui

---

### Task 1: Add a Post model and database sync

**Files:**
- Modify: `prisma/schema.prisma`
- Modify: `lib/types.ts`

- [ ] **Step 1: Update the Prisma schema for posts**

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  picture   String?
  oauthId   String   @unique
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  posts     Post[]
}

model Post {
  id        String   @id @default(cuid())
  title     String
  content   String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  authorId  String
  author    User     @relation(fields: [authorId], references: [id])

  @@index([createdAt])
  @@index([authorId])
}
```

- [ ] **Step 2: Update shared types for the new board shape**

```ts
export interface User {
  id: string
  email: string
  name?: string | null
  picture?: string | null
  oauthId: string
  createdAt: Date
  updatedAt: Date
}

export interface Post {
  id: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
  authorId: string
  author?: {
    id: string
    name?: string | null
    email: string
    picture?: string | null
  }
}
```

- [ ] **Step 3: Push the schema and regenerate Prisma**

Run:
```bash
npx prisma db push
npx prisma generate
```
Expected: Prisma syncs the `Post` table and regenerates the client without errors.

- [ ] **Step 4: Commit**

```bash
git add prisma/schema.prisma lib/types.ts package-lock.json
git commit -m "feat: add post model for board"
```

### Task 2: Add board API routes

**Files:**
- Create: `pages/api/posts/index.ts`
- Create: `pages/api/posts/[id].ts`
- Modify: `pages/api/user.ts`
- Modify: `lib/auth.ts`

- [ ] **Step 1: Add a listing/creation API for posts**

```ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { getSessionUser, getMissingAuthConfig, setNextAuthBaseUrl } from '@/lib/auth'

setNextAuthBaseUrl()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const missingConfig = getMissingAuthConfig()
  if (missingConfig.length > 0) {
    return res.status(500).json({ error: 'Missing Google OAuth configuration', missing: missingConfig })
  }

  if (req.method === 'GET') {
    const { prisma } = await import('@/lib/db')
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        author: { select: { id: true, name: true, email: true, picture: true } },
      },
    })
    return res.status(200).json(posts)
  }

  if (req.method === 'POST') {
    const user = await getSessionUser(req, res)
    if (!user) return res.status(401).json({ error: 'Unauthorized' })

    const title = String(req.body?.title || '').trim()
    const content = String(req.body?.content || '').trim()
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' })
    }

    const { prisma } = await import('@/lib/db')
    const author = await prisma.user.findUnique({ where: { oauthId: user.oauthId }, select: { id: true } })
    if (!author) return res.status(404).json({ error: 'Author not found' })

    const post = await prisma.post.create({
      data: { title, content, authorId: author.id },
      include: {
        author: { select: { id: true, name: true, email: true, picture: true } },
      },
    })

    return res.status(201).json(post)
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
```

- [ ] **Step 2: Add a single-post API for the detail page**

```ts
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { id } = req.query
  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid post id' })
  }

  const { prisma } = await import('@/lib/db')
  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      author: { select: { id: true, name: true, email: true, picture: true } },
    },
  })

  if (!post) return res.status(404).json({ error: 'Post not found' })
  return res.status(200).json(post)
}
```

- [ ] **Step 3: Make `/api/user` return the current signed-in Prisma user**

```ts
const user = await prisma.user.findUnique({
  where: { oauthId: session.user.email || '' },
  select: { id: true, email: true, name: true, picture: true, oauthId: true },
})
```

- [ ] **Step 4: Keep the auth helper aligned with the new board flow**

```ts
return {
  id: session.user.email || session.user.name || '',
  email: session.user.email || '',
  name: session.user.name,
  picture: session.user.image,
  oauthId: session.user.email || '',
}
```

- [ ] **Step 5: Commit**

```bash
git add pages/api/posts/index.ts pages/api/posts/[id].ts pages/api/user.ts lib/auth.ts
git commit -m "feat: add board api routes"
```

### Task 3: Replace dashboard with a cafe-style board home

**Files:**
- Modify: `pages/dashboard.tsx`
- Modify: `components/Navbar.tsx`
- Modify: `components/Layout.tsx`
- Modify: `styles/globals.css`

- [ ] **Step 1: Write the board home layout**

```tsx
export default function Dashboard() {
  return (
    <ProtectedRoute>
      <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="rounded-2xl border bg-white p-4 shadow-sm">
          <div className="mb-4 rounded-xl bg-slate-50 p-4">
            <p className="text-xs font-semibold text-sky-600">Cafe Board</p>
            <h2 className="mt-2 text-lg font-bold text-slate-900">게시판 홈</h2>
            <p className="mt-1 text-sm text-slate-500">로그인한 사람만 글을 쓸 수 있어요.</p>
          </div>
          <nav className="space-y-2 text-sm">
            <a className="block rounded-lg bg-sky-50 px-3 py-2 font-medium text-sky-700" href="#board">
              전체글
            </a>
            <a className="block rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-50" href="#write">
              글쓰기
            </a>
          </nav>
        </aside>

        <section id="board" className="space-y-6">
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-sky-600">Community</p>
                <h1 className="text-2xl font-bold text-slate-900">자유게시판</h1>
              </div>
              <Button className="bg-sky-600 text-white hover:bg-sky-700" asChild>
                <a href="#write">글쓰기</a>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </ProtectedRoute>
  )
}
```

- [ ] **Step 2: Make the top navigation feel more like a cafe**

```tsx
<nav className="border-b border-slate-200 bg-white/90 backdrop-blur">
  <div className="container flex h-16 items-center justify-between">
    <Link href="/dashboard" className="flex items-center gap-3">
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-600 text-sm font-bold text-white">
        B
      </span>
      <span className="font-semibold text-slate-900">Boilerplate Cafe</span>
    </Link>
  </div>
</nav>
```

- [ ] **Step 3: Add cafe-like global background polish**

```css
body {
  @apply bg-slate-100 text-slate-900;
  background-image: linear-gradient(to bottom, rgba(255,255,255,0.65), rgba(255,255,255,0.95));
}
```

- [ ] **Step 4: Commit**

```bash
git add pages/dashboard.tsx components/Navbar.tsx components/Layout.tsx styles/globals.css
git commit -m "feat: redesign dashboard as board home"
```

### Task 4: Add post writing and reading UI

**Files:**
- Create: `components/board/PostComposer.tsx`
- Create: `components/board/PostList.tsx`
- Create: `components/board/PostCard.tsx`
- Create: `pages/posts/[id].tsx`
- Modify: `pages/dashboard.tsx`

- [ ] **Step 1: Implement a post composer**

```tsx
export function PostComposer({ onCreate }: { onCreate: (payload: { title: string; content: string }) => Promise<void> }) {
  // textarea + title input + submit button
}
```

- [ ] **Step 2: Implement a cafe-style post list**

```tsx
export function PostList({ posts }: { posts: Post[] }) {
  // rows with title, author, date, and preview
}
```

- [ ] **Step 3: Implement a post detail page**

```tsx
export default function PostDetailPage() {
  // fetch /api/posts/[id] and render title, author, body
}
```

- [ ] **Step 4: Commit**

```bash
git add components/board/PostComposer.tsx components/board/PostList.tsx components/board/PostCard.tsx pages/posts/[id].tsx pages/dashboard.tsx
git commit -m "feat: add board post composer and detail view"
```

### Task 5: Verify the full flow

**Files:**
- Modify: any files needed from Tasks 1-4

- [ ] **Step 1: Run schema sync and build**

Run:
```bash
npx prisma db push
npm run build
```
Expected: Prisma sync succeeds and the production build passes.

- [ ] **Step 2: Manual smoke test**

Run the app locally and verify:
```bash
npm run dev
```
Expected:
- signing in lands on `/dashboard`
- the dashboard shows a board-style layout
- creating a post shows it in the list
- opening a post detail page renders the content

- [ ] **Step 3: Commit**

```bash
git add .
git commit -m "feat: board home for logged in users"
```

## Self-Review

- Spec coverage: all requested behavior is covered by board schema, APIs, dashboard UI, and detail page tasks.
- Placeholder scan: no TBD/TODO placeholders remain.
- Type consistency: `User` and `Post` shapes are aligned between schema, API, and UI tasks.
