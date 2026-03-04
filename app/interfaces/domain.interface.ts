export interface User {
  id: number
  email: string
  role: 'admin' | 'editor'
  createdAt: string
}

export interface Post {
  id: number
  title: string
  slug: string
  excerpt: string
  content: string
  coverImage: string | null
  publishedAt: string | null
  status: 'draft' | 'published'
  authorId: number
}

export interface PostTag {
  id: number
  postId: number
  tag: string
}

export interface ContactMessage {
  id: number
  name: string
  email: string
  subject: string
  message: string
  createdAt: string
  status: 'unread' | 'read' | 'archived'
}

export interface SiteSetting {
  id: number
  key: string
  value: string
}
