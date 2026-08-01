import type { Post, PostMeta } from '../types/blog'

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
    let value: unknown = line.slice(colon + 1).trim()

    if (typeof value === 'string') {
      let s: string = value
      if (s.startsWith('"') && s.endsWith('"')) s = s.slice(1, -1)
      if (s.startsWith('[') && s.endsWith(']')) {
        value = s.slice(1, -1).split(',').map((x: string) => x.trim().replace(/^"|"$/g, ''))
      } else {
        value = s
      }
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

function deriveExcerpt(content: string, maxLen = 180): string {
  const stripped = content
    .replace(/^---[\s\S]*?---\n/, '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]*`/g, '')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/[*_~>]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
  if (stripped.length <= maxLen) return stripped
  const truncated = stripped.slice(0, maxLen)
  const lastSpace = truncated.lastIndexOf(' ')
  return (lastSpace > 80 ? truncated.slice(0, lastSpace) : truncated) + '…'
}

function readingTime(text: string): string {
  const words = text.trim().split(/\s+/).length
  const minutes = Math.max(1, Math.ceil(words / 200))
  return `${minutes} min read`
}

const modules = import.meta.glob('/src/content/posts/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

function buildAllPosts(): Post[] {
  const posts: Post[] = []
  for (const [path, raw] of Object.entries(modules)) {
    const slug = path.split('/').pop()?.replace(/\.md$/, '') ?? ''
    const { meta, content } = parseFrontmatter(raw)
    if (!meta.published) continue
    const excerpt = meta.excerpt?.trim() ? meta.excerpt : deriveExcerpt(content)
    posts.push({
      slug,
      meta: { ...meta, excerpt },
      content,
      readingTime: readingTime(content),
    })
  }
  posts.sort((a, b) => new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime())
  return posts
}

const allPosts = buildAllPosts()

export function getAllPosts(): Post[] {
  return allPosts
}

export function getPost(slug: string): Post | undefined {
  return allPosts.find((p) => p.slug === slug)
}

export function getAllTags(): { tag: string; count: number }[] {
  const counts = new Map<string, number>()
  for (const post of allPosts) {
    for (const tag of post.meta.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1)
    }
  }
  return Array.from(counts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag))
}

export function getPostsByTag(tag: string): Post[] {
  return allPosts.filter((p) => p.meta.tags.includes(tag))
}

export function getAdjacentPosts(slug: string): { prev: Post | null; next: Post | null } {
  const idx = allPosts.findIndex((p) => p.slug === slug)
  if (idx === -1) return { prev: null, next: null }
  return {
    prev: idx < allPosts.length - 1 ? allPosts[idx + 1] : null,
    next: idx > 0 ? allPosts[idx - 1] : null,
  }
}
