export interface DbUser {
  id: number
  email: string
  password_hash: string
  role: 'admin' | 'editor'
  created_at: Date
}

export interface DbPost {
  id: number
  title: string
  slug: string
  excerpt: string
  content: string
  cover_image: string | null
  published_at: Date | null
  status: 'draft' | 'published'
  author_id: number
}

export interface DbPostTag {
  id: number
  post_id: number
  tag: string
}

export interface DbContactMessage {
  id: number
  name: string
  email: string
  subject: string
  message: string
  created_at: Date
  status: 'unread' | 'read' | 'archived'
}

export interface DbSiteSetting {
  id: number
  key: string
  value: string
}
