import type { Post, PostMeta } from '../types/blog'
import { readingTime } from './readingTime'

function parseFrontmatter(text: string): { meta: PostMeta; content: string } {
  const defaultMeta: PostMeta = {
    title: '',
    date: '',
    tags: [],
    excerpt: '',
    published: true,
  }

  const match = text.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
  if (!match) return { meta: defaultMeta, content: text }

  const raw = match[1]
  const body = match[2].trim()
  const meta = { ...defaultMeta }

  for (const line of raw.split('\n')) {
    const colon = line.indexOf(':')
    if (colon === -1) continue
    const key = line.slice(0, colon).trim()
    let value: any = line.slice(colon + 1).trim()

    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1)
    if (value.startsWith('[') && value.endsWith(']')) {
      value = value.slice(1, -1).split(',').map((s: string) => s.trim().replace(/^"|"$/g, ''))
    }
    if (value === 'true') value = true
    if (value === 'false') value = false

    if (key === 'tags') meta.tags = value as string[]
    else if (key === 'published') meta.published = value as boolean
    else if (key === 'title') meta.title = value as string
    else if (key === 'date') meta.date = value as string
    else if (key === 'excerpt') meta.excerpt = value as string
  }

  return { meta, content: body }
}

const modules = import.meta.glob('/src/content/posts/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

export function getAllPosts(): Post[] {
  const posts: Post[] = []

  for (const [path, raw] of Object.entries(modules)) {
    const slug = path.split('/').pop()?.replace(/\.md$/, '') ?? ''
    const { meta, content } = parseFrontmatter(raw as string)
    if (!meta.published) continue
    posts.push({
      slug,
      meta,
      content,
      readingTime: readingTime(content),
    })
  }

  posts.sort((a, b) => new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime())
  return posts
}

export function getPost(slug: string): Post | undefined {
  return getAllPosts().find((p) => p.slug === slug)
}
