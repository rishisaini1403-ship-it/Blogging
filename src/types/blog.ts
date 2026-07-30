export interface PostMeta {
  title: string
  date: string
  tags: string[]
  excerpt: string
  published: boolean
}

export interface Post {
  slug: string
  meta: PostMeta
  content: string
  readingTime: string
}
