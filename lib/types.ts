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
