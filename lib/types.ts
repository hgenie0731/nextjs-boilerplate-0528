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
