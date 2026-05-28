export interface User {
  id: string
  email: string
  name?: string | null
  picture?: string | null
  oauthId: string
  createdAt: Date
  updatedAt: Date
}

export interface SessionUser {
  id: string
  email: string
  name?: string | null
  picture?: string | null
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
    email: string
    name?: string | null
    picture?: string | null
  }
}
