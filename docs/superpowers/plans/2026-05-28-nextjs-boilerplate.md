# Next.js 표준 보일러플레이트 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a production-ready Next.js boilerplate with Tailwind, shadcn/ui, Auth0 (Google login), and MongoDB integration.

**Architecture:** Initialize a Next.js project with Pages Router, set up Tailwind and shadcn for styling, integrate Auth0 for authentication with Google login, and connect Prisma to MongoDB for data persistence. Pages are protected with session validation, and API routes handle user operations.

**Tech Stack:** Next.js 14 (Pages Router), React 18, TypeScript, Tailwind CSS, shadcn/ui, Auth0 (@auth0/nextjs-auth0), Prisma, MongoDB, ESLint, Prettier

---

## Phase 1: 프로젝트 초기화

### Task 1: package.json 작성

**Files:**
- Create: `package.json`

- [ ] **Step 1: Create package.json with dependencies**

```json
{
  "name": "nextjs-boilerplate",
  "version": "1.0.0",
  "description": "Next.js boilerplate with Tailwind, shadcn, Auth0, and MongoDB",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "format": "prettier --write .",
    "db:push": "prisma db push",
    "db:studio": "prisma studio"
  },
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@auth0/nextjs-auth0": "^3.0.0",
    "@prisma/client": "^5.0.0",
    "tailwindcss": "^3.3.0",
    "postcss": "^8.4.31",
    "autoprefixer": "^10.4.16",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.2.0"
  },
  "devDependencies": {
    "typescript": "^5.2.0",
    "@types/node": "^20.4.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "prisma": "^5.0.0",
    "eslint": "^8.45.0",
    "eslint-config-next": "^14.0.0",
    "prettier": "^3.0.0"
  }
}
```

- [ ] **Step 2: Run npm install to verify configuration**

```bash
npm install
```

Expected: All dependencies installed without errors.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "feat: initialize package.json with dependencies"
```

---

### Task 2: TypeScript와 Next.js 설정

**Files:**
- Create: `tsconfig.json`
- Create: `next.config.js`
- Create: `.eslintrc.json`

- [ ] **Step 1: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "preserve",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "isolatedModules": true,
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 2: Create next.config.js**

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
}

module.exports = nextConfig
```

- [ ] **Step 3: Create .eslintrc.json**

```json
{
  "extends": "next/core-web-vitals"
}
```

- [ ] **Step 4: Create .gitignore**

```
.env
.env.local
.env.*.local
node_modules
.next
dist
out
.DS_Store
*.pem
.idea
.vscode
*.swp
*.swo
*~
```

- [ ] **Step 5: Create .prettierrc**

```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5"
}
```

- [ ] **Step 6: Commit**

```bash
git add tsconfig.json next.config.js .eslintrc.json .gitignore .prettierrc
git commit -m "feat: configure TypeScript, Next.js, and linting"
```

---

## Phase 2: Tailwind CSS 및 shadcn/ui 설정

### Task 3: Tailwind CSS 설정

**Files:**
- Create: `tailwind.config.ts`
- Create: `postcss.config.js`
- Create: `styles/globals.css`
- Create: `styles/variables.css`

- [ ] **Step 1: Create tailwind.config.ts**

```typescript
import type { Config } from 'tailwindcss'

const config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config

export default config
```

- [ ] **Step 2: Create postcss.config.js**

```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

- [ ] **Step 3: Create styles/variables.css**

```css
:root {
  --background: 0 0% 100%;
  --foreground: 0 0% 3.6%;
  --card: 0 0% 100%;
  --card-foreground: 0 0% 3.6%;
  --popover: 0 0% 100%;
  --popover-foreground: 0 0% 3.6%;
  --muted: 0 0% 96.1%;
  --muted-foreground: 0 0% 45.1%;
  --accent: 0 0% 9.0%;
  --accent-foreground: 0 0% 98%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 0 0% 98%;
  --border: 0 0% 89.8%;
  --input: 0 0% 89.8%;
  --primary: 0 0% 9.0%;
  --primary-foreground: 0 0% 98%;
  --secondary: 0 0% 96.1%;
  --secondary-foreground: 0 0% 9.0%;
  --ring: 0 0% 3.6%;
  --radius: 0.5rem;
}

.dark {
  --background: 0 0% 3.6%;
  --foreground: 0 0% 98%;
  --card: 0 0% 3.6%;
  --card-foreground: 0 0% 98%;
  --popover: 0 0% 3.6%;
  --popover-foreground: 0 0% 98%;
  --muted: 0 0% 14.9%;
  --muted-foreground: 0 0% 63.9%;
  --accent: 0 0% 98%;
  --accent-foreground: 0 0% 9.0%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 0 0% 9.0%;
  --border: 0 0% 14.9%;
  --input: 0 0% 14.9%;
  --primary: 0 0% 98%;
  --primary-foreground: 0 0% 9.0%;
  --secondary: 0 0% 14.9%;
  --secondary-foreground: 0 0% 98%;
  --ring: 0 0% 83.3%;
}
```

- [ ] **Step 4: Create styles/globals.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-background text-foreground;
  }
}
```

- [ ] **Step 5: Commit**

```bash
git add tailwind.config.ts postcss.config.js styles/
git commit -m "feat: configure Tailwind CSS with shadcn theme"
```

---

### Task 4: shadcn/ui 컴포넌트 설정

**Files:**
- Create: `components.json`
- Create: `components/ui/button.tsx`
- Create: `components/ui/card.tsx`

- [ ] **Step 1: Create components.json**

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": false,
  "tsx": true,
  "aliasPrefix": "@",
  "baseColor": "slate"
}
```

- [ ] **Step 2: Create components/ui/button.tsx**

```typescript
import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline:
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
```

- [ ] **Step 3: Create components/ui/card.tsx**

```typescript
import * as React from 'react'
import { cn } from '@/lib/utils'

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'rounded-lg border border-border bg-card text-card-foreground shadow-sm',
      className
    )}
    {...props}
  />
))
Card.displayName = 'Card'

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-6', className)}
    {...props}
  />
))
CardHeader.displayName = 'CardHeader'

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn(
      'text-2xl font-semibold leading-none tracking-tight',
      className
    )}
    {...props}
  />
))
CardTitle.displayName = 'CardTitle'

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
))
CardContent.displayName = 'CardContent'

export { Card, CardHeader, CardTitle, CardContent }
```

- [ ] **Step 4: Install shadcn dependencies**

```bash
npm install @radix-ui/react-slot class-variance-authority tailwindcss-animate
```

Expected: Dependencies installed successfully.

- [ ] **Step 5: Commit**

```bash
git add components.json components/ui/
git commit -m "feat: add shadcn Button and Card components"
```

---

## Phase 3: Prisma 및 MongoDB 설정

### Task 5: Prisma 초기화

**Files:**
- Create: `prisma/schema.prisma`

- [ ] **Step 1: Create prisma/schema.prisma**

```prisma
// prisma/schema.prisma
datasource db {
  provider = "mongodb"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  email     String   @unique
  name      String?
  picture   String?
  auth0Id   String   @unique
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

- [ ] **Step 2: Create .env.example**

```
# Auth0
AUTH0_SECRET=your-auth0-secret-here
AUTH0_BASE_URL=http://localhost:3000
AUTH0_ISSUER_BASE_URL=https://your-domain.auth0.com
AUTH0_CLIENT_ID=your-client-id
AUTH0_CLIENT_SECRET=your-client-secret

# MongoDB
DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/database
```

- [ ] **Step 3: Commit**

```bash
git add prisma/ .env.example
git commit -m "feat: configure Prisma with MongoDB and User model"
```

---

## Phase 4: 유틸리티 및 헬퍼 함수

### Task 6: 공용 유틸리티

**Files:**
- Create: `lib/utils.ts`
- Create: `lib/types.ts`

- [ ] **Step 1: Create lib/utils.ts**

```typescript
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

- [ ] **Step 2: Create lib/types.ts**

```typescript
export interface User {
  id: string
  email: string
  name?: string | null
  picture?: string | null
  auth0Id: string
  createdAt: Date
  updatedAt: Date
}

export interface SessionUser {
  sub: string
  email: string
  name?: string
  picture?: string
}
```

- [ ] **Step 3: Commit**

```bash
git add lib/utils.ts lib/types.ts
git commit -m "feat: add utility functions and TypeScript types"
```

---

### Task 7: Auth0 및 DB 헬퍼

**Files:**
- Create: `lib/db.ts`
- Create: `lib/auth.ts`

- [ ] **Step 1: Create lib/db.ts**

```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

- [ ] **Step 2: Create lib/auth.ts**

```typescript
import { getSession } from '@auth0/nextjs-auth0'
import { SessionUser } from './types'

export async function getSessionUser(): Promise<SessionUser | null> {
  const session = await getSession()
  if (!session || !session.user) {
    return null
  }

  return {
    sub: session.user.sub,
    email: session.user.email || '',
    name: session.user.name,
    picture: session.user.picture,
  }
}

export function getAuth0LoginUrl(): string {
  return `${process.env.AUTH0_BASE_URL}/api/auth/login`
}

export function getAuth0LogoutUrl(): string {
  return `${process.env.AUTH0_BASE_URL}/api/auth/logout`
}
```

- [ ] **Step 3: Commit**

```bash
git add lib/db.ts lib/auth.ts
git commit -m "feat: add Prisma client and Auth0 helpers"
```

---

## Phase 5: 컴포넌트 구현

### Task 8: Layout 및 Navbar 컴포넌트

**Files:**
- Create: `components/Layout.tsx`
- Create: `components/Navbar.tsx`

- [ ] **Step 1: Create components/Layout.tsx**

```typescript
import React from 'react'
import Navbar from './Navbar'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-8">{children}</main>
    </div>
  )
}
```

- [ ] **Step 2: Create components/Navbar.tsx**

```typescript
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Button } from './ui/button'

interface User {
  email: string
  name?: string
}

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch('/api/user')
        if (response.ok) {
          const data = await response.json()
          setUser(data)
        }
      } catch (error) {
        console.error('Failed to fetch user:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'GET' })
    router.push('/')
  }

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
                {user.name || user.email}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </>
          ) : (
            <Link href="/api/auth/login">
              <Button size="sm">Login</Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add components/Layout.tsx components/Navbar.tsx
git commit -m "feat: add Layout and Navbar components"
```

---

### Task 9: ProtectedRoute 컴포넌트

**Files:**
- Create: `components/ProtectedRoute.tsx`

- [ ] **Step 1: Create components/ProtectedRoute.tsx**

```typescript
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import React from 'react'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const router = useRouter()

  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch('/api/user')
        if (response.ok) {
          setIsAuthenticated(true)
        } else {
          setIsAuthenticated(false)
          router.push('/')
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        setIsAuthenticated(false)
        router.push('/')
      }
    }

    checkAuth()
  }, [router])

  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  return isAuthenticated ? children : null
}
```

- [ ] **Step 2: Commit**

```bash
git add components/ProtectedRoute.tsx
git commit -m "feat: add ProtectedRoute component for authenticated pages"
```

---

## Phase 6: 페이지 구현

### Task 10: _document와 _app 페이지

**Files:**
- Create: `pages/_document.tsx`
- Create: `pages/_app.tsx`

- [ ] **Step 1: Create pages/_document.tsx**

```typescript
import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="ko">
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Next.js Boilerplate" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
```

- [ ] **Step 2: Create pages/_app.tsx**

```typescript
import type { AppProps } from 'next/app'
import Layout from '@/components/Layout'
import '@/styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add pages/_document.tsx pages/_app.tsx
git commit -m "feat: add document and app configuration pages"
```

---

### Task 11: 로그인 페이지

**Files:**
- Create: `pages/index.tsx`

- [ ] **Step 1: Create pages/index.tsx**

```typescript
import { useEffect } from 'react'
import { useRouter } from 'next/router'
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
          <a href="/api/auth/login">
            <Button className="w-full">Sign in with Google</Button>
          </a>
        </CardContent>
      </Card>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add pages/index.tsx
git commit -m "feat: add home/login page"
```

---

### Task 12: 대시보드 페이지

**Files:**
- Create: `pages/dashboard.tsx`

- [ ] **Step 1: Create pages/dashboard.tsx**

```typescript
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import ProtectedRoute from '@/components/ProtectedRoute'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

interface User {
  id: string
  email: string
  name?: string
  picture?: string
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch('/api/user')
        if (response.ok) {
          const data = await response.json()
          setUser(data)
        } else {
          router.push('/')
        }
      } catch (error) {
        console.error('Failed to fetch user:', error)
        router.push('/')
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [router])

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </ProtectedRoute>
    )
  }

  if (!user) {
    return null
  }

  return (
    <ProtectedRoute>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Welcome, {user.name}!</h1>
          <p className="text-muted-foreground">
            You are successfully logged in
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>User Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {user.picture && (
              <div className="flex justify-center">
                <img
                  src={user.picture}
                  alt={user.name}
                  className="w-24 h-24 rounded-full"
                />
              </div>
            )}
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{user.email}</p>
            </div>
            {user.name && (
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{user.name}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-muted-foreground">User ID</p>
              <p className="font-medium text-xs break-all">{user.id}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add pages/dashboard.tsx
git commit -m "feat: add protected dashboard page"
```

---

## Phase 7: API 라우트 구현

### Task 13: Auth0 콜백 및 사용자 API

**Files:**
- Create: `pages/api/auth/[...auth0].ts`
- Create: `pages/api/user.ts`

- [ ] **Step 1: Create pages/api/auth/[...auth0].ts**

```typescript
import { handleAuth, handleLogin, handleCallback } from '@auth0/nextjs-auth0'
import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/db'

const afterCallback = async (session: any, _state: any) => {
  try {
    // Create or update user in database
    const user = await prisma.user.upsert({
      where: { auth0Id: session.user.sub },
      update: {
        name: session.user.name,
        picture: session.user.picture,
      },
      create: {
        auth0Id: session.user.sub,
        email: session.user.email,
        name: session.user.name,
        picture: session.user.picture,
      },
    })

    session.user.dbId = user.id
  } catch (error) {
    console.error('Error in afterCallback:', error)
  }

  return session
}

export default handleAuth({
  async callback(req: NextApiRequest, res: NextApiResponse) {
    try {
      await handleCallback(req, res, { afterCallback })
    } catch (error) {
      res.status(error instanceof Error ? 500 : 400).end(error)
    }
  },
})
```

- [ ] **Step 2: Create pages/api/user.ts**

```typescript
import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from '@auth0/nextjs-auth0'
import { prisma } from '@/lib/db'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const session = await getSession(req, res)

    if (!session || !session.user) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const user = await prisma.user.findUnique({
      where: { auth0Id: session.user.sub },
      select: {
        id: true,
        email: true,
        name: true,
        picture: true,
      },
    })

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.status(200).json(user)
  } catch (error) {
    console.error('Error fetching user:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add pages/api/
git commit -m "feat: add Auth0 callback and user API routes"
```

---

## Phase 8: 마무리 및 문서화

### Task 14: README 작성

**Files:**
- Create: `README.md`

- [ ] **Step 1: Create README.md**

```markdown
# Next.js 표준 보일러플레이트

Tailwind CSS, shadcn/ui, Auth0 (Google login), MongoDB가 통합된 Next.js 보일러플레이트입니다.

## 기술 스택

- **Framework:** Next.js 14 (Pages Router)
- **Styling:** Tailwind CSS + shadcn/ui
- **Authentication:** Auth0
- **Database:** MongoDB + Prisma
- **Language:** TypeScript

## 빠른 시작

### 1. 환경 변수 설정

\`.env.local\` 파일을 생성하고 다음 변수를 설정합니다:

\`\`\`bash
# Auth0
AUTH0_SECRET=your-secret-here
AUTH0_BASE_URL=http://localhost:3000
AUTH0_ISSUER_BASE_URL=https://your-domain.auth0.com
AUTH0_CLIENT_ID=your-client-id
AUTH0_CLIENT_SECRET=your-client-secret

# MongoDB
DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/database
\`\`\`

### 2. 의존성 설치

\`\`\`bash
npm install
\`\`\`

### 3. 데이터베이스 설정

\`\`\`bash
npx prisma db push
\`\`\`

### 4. 개발 서버 시작

\`\`\`bash
npm run dev
\`\`\`

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어보세요.

## 프로젝트 구조

\`\`\`
nextjs-boilerplate/
├── pages/              # Next.js 페이지
├── components/         # React 컴포넌트
├── lib/               # 유틸리티 및 헬퍼 함수
├── prisma/            # Prisma 스키마
├── public/            # 정적 파일
├── styles/            # 전역 CSS
└── docs/              # 문서
\`\`\`

## 주요 페이지

- **홈 (/)**
  - 로그인하지 않은 사용자를 위한 진입점
  - "Google로 로그인" 버튼
  - 로그인 후 자동으로 대시보드로 리다이렉트

- **대시보드 (/dashboard)**
  - 로그인한 사용자만 접근 가능
  - 사용자 프로필 정보 표시

## API 엔드포인트

- **GET /api/user**
  - 현재 로그인한 사용자의 정보 반환
  - 응답: \`{ id, email, name, picture }\`

- **GET/POST /api/auth/[...auth0]**
  - Auth0 통합 엔드포인트
  - 로그인, 로그아웃, 콜백 처리

## 개발 명령어

\`\`\`bash
npm run dev       # 개발 서버 시작
npm run build     # 프로덕션 빌드
npm run start     # 프로덕션 서버 시작
npm run lint      # ESLint 실행
npm run format    # Prettier 포맷

# Prisma
npx prisma db push    # 스키마 변경 적용
npx prisma studio    # 데이터베이스 시각화
\`\`\`

## 배포

### Vercel 배포

1. GitHub에 코드를 푸시합니다
2. [Vercel](https://vercel.com)에 로그인하고 프로젝트를 연결합니다
3. 환경 변수를 Vercel 대시보드에서 설정합니다
4. 배포합니다

## Auth0 설정

### Auth0 애플리케이션 생성

1. [Auth0 Dashboard](https://manage.auth0.com)에서 로그인합니다
2. "Create Application"을 클릭합니다
3. 애플리케이션 이름을 입력합니다 (예: "Next.js Boilerplate")
4. "Single Page Web Applications"를 선택합니다
5. 생성합니다

### Google 소셜 로그인 설정

1. Auth0 Dashboard의 "Connections" > "Social"로 이동합니다
2. "Google"을 클릭하고 설정합니다
3. Google OAuth 자격증명을 입력합니다
4. 애플리케이션에서 Google을 활성화합니다

### Auth0 변수 설정

생성한 애플리케이션에서 다음 정보를 복사합니다:

- **Domain:** \`AUTH0_ISSUER_BASE_URL\`
- **Client ID:** \`AUTH0_CLIENT_ID\`
- **Client Secret:** \`AUTH0_CLIENT_SECRET\`
- **Secret:** \`AUTH0_SECRET\` (무작위 문자열 생성)

## 다음 단계

이 보일러플레이트는 다음을 쉽게 확장할 수 있습니다:

- 새로운 데이터 모델 추가 (Prisma schema)
- 새로운 API 엔드포인트 추가 (pages/api/)
- 새로운 페이지 추가 (pages/)
- 새로운 컴포넌트 추가 (components/)

## 라이선스

MIT
\`\`\`

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs: add comprehensive README"
```

---

### Task 15: 최종 확인 및 준비

**Files:**
- Modify: `package.json` (scripts 추가)

- [ ] **Step 1: Verify project structure**

Run the following commands to verify the project is ready:

```bash
ls -la pages/
ls -la components/
ls -la lib/
ls -la prisma/
ls -la styles/
```

Expected: All directories and files created successfully.

- [ ] **Step 2: Verify Next.js configuration**

```bash
npm run lint
```

Expected: No errors (may have warnings).

- [ ] **Step 3: Create .gitkeep files for empty directories (if needed)**

```bash
touch public/.gitkeep
```

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "feat: complete Next.js boilerplate setup"
```

---

## 구현 검증 체크리스트

완료 후 다음을 확인하세요:

- [ ] 프로젝트 구조가 설계와 일치합니까?
- [ ] 모든 의존성이 설치되었습니까?
- [ ] TypeScript 설정이 올바릅니까?
- [ ] Tailwind CSS가 정상 작동합니까?
- [ ] shadcn/ui 컴포넌트가 임포트 가능합니까?
- [ ] Prisma schema가 유효합니까?
- [ ] 환경 변수 템플릿이 완성되었습니까?
- [ ] README가 명확합니까?

---

## 다음 단계

1. `.env.local` 파일을 생성하고 Auth0 및 MongoDB 자격증명을 추가합니다
2. `npm install` 실행
3. `npm run dev` 실행
4. http://localhost:3000 에서 프로젝트 테스트

완성되면 이 보일러플레이트를 GitHub에 푸시하고 다른 프로젝트에서 사용할 수 있습니다.
