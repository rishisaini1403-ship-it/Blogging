export interface PostFormData {
  slug: string
  title: string
  date: string
  tags: string[]
  excerpt: string
  published: boolean
  content: string
}

interface ApiFile {
  name: string
  sha: string
  raw: string
}

const API = '/api/github-proxy'

async function post(body: unknown) {
  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Request failed')
  return data
}

export interface AdminPost {
  slug: string
  title: string
  date: string
  tags: string[]
  excerpt: string
  published: boolean
  content: string
  sha: string
}

function parseRaw(raw: string): { frontmatter: Record<string, unknown>; content: string } {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
  if (!match) return { frontmatter: {}, content: raw }
  const fm: Record<string, unknown> = {}
  for (const line of match[1].split('\n')) {
    const ci = line.indexOf(':')
    if (ci === -1) continue
    const k = line.slice(0, ci).trim()
    let v: unknown = line.slice(ci + 1).trim()
    if (typeof v === 'string' && v.startsWith('"') && v.endsWith('"')) v = v.slice(1, -1)
    if (typeof v === 'string' && v.startsWith('[') && v.endsWith(']')) {
      v = v.slice(1, -1).split(',').map((s) => s.trim().replace(/^"|"$/g, ''))
    }
    if (v === 'true') v = true
    if (v === 'false') v = false
    fm[k] = v
  }
  return { frontmatter: fm, content: match[2].trim() }
}

export async function fetchAllAdminPosts(): Promise<AdminPost[]> {
  const { posts } = await post({ action: 'list' }) as { posts: ApiFile[] }
  return posts.map((f) => {
    const slug = f.name.replace(/\.md$/, '')
    const { frontmatter, content } = parseRaw(f.raw)
    return {
      slug,
      title: (frontmatter.title as string) || slug,
      date: (frontmatter.date as string) || '',
      tags: (frontmatter.tags as string[]) || [],
      excerpt: (frontmatter.excerpt as string) || '',
      published: (frontmatter.published as boolean) ?? true,
      content,
      sha: f.sha,
    }
  })
}

export async function createAdminPost(data: PostFormData): Promise<void> {
  await post({ action: 'create', ...data })
}

export async function updateAdminPost(currentSlug: string, data: PostFormData): Promise<void> {
  await post({ action: 'update', ...data, slug: currentSlug })
}

export async function deleteAdminPost(slug: string): Promise<void> {
  await post({ action: 'delete', slug })
}
