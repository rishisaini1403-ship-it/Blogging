import type { VercelRequest, VercelResponse } from '@vercel/node'
import crypto from 'crypto'

const SECRET = process.env.SESSION_SECRET || ''
const GH_TOKEN = process.env.GITHUB_TOKEN || ''
const GH_OWNER = process.env.GITHUB_OWNER || ''
const GH_REPO = process.env.GITHUB_REPO || ''

const POSTS_DIR = 'src/content/posts'
const IMAGES_DIR = 'public/images'

function verifySession(token: string): boolean {
  const parts = token.split('.')
  if (parts.length !== 2) return false
  const [b64, sig] = parts
  const expected = crypto.createHmac('sha256', SECRET).update(b64).digest('hex')
  if (sig !== expected) return false
  try {
    const { exp } = JSON.parse(Buffer.from(b64, 'base64url').toString())
    return Date.now() < exp
  } catch {
    return false
  }
}

const GH_HEADERS = {
  Authorization: `Bearer ${GH_TOKEN}`,
  Accept: 'application/vnd.github+json',
  'User-Agent': 'harish-portfolio-admin',
}

async function ghFetch(path: string, options: RequestInit = {}) {
  return fetch(`https://api.github.com/repos/${GH_OWNER}/${GH_REPO}/contents/${path}`, {
    ...options,
    headers: { ...GH_HEADERS, ...(options.headers as Record<string, string>) },
  })
}

async function getSha(path: string): Promise<string | null> {
  const res = await ghFetch(path)
  if (res.status === 404) return null
  if (!res.ok) throw new Error(`Failed to fetch SHA for ${path}: ${res.status}`)
  const data = await res.json()
  return data.sha as string
}

function makeFrontmatter(data: {
  title: string
  date: string
  tags: string[]
  excerpt: string
  published: boolean
}): string {
  const tags = data.tags.map((t) => `"${t}"`).join(', ')
  return [
    '---',
    `title: "${data.title}"`,
    `date: "${data.date}"`,
    `tags: [${tags}]`,
    `excerpt: "${data.excerpt}"`,
    `published: ${data.published}`,
    '---',
    '',
  ].join('\n')
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const cookie = req.cookies?.admin_session
  if (!cookie || !verifySession(cookie)) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  if (!GH_TOKEN || !GH_OWNER || !GH_REPO) {
    return res.status(500).json({ error: 'GitHub not configured' })
  }

  const { action, slug, title, date, tags, excerpt, published, content: mdContent, filename, encoding } = req.body || {}

  try {
    switch (action) {
      case 'list': {
        const res2 = await ghFetch(POSTS_DIR)
        if (res2.status === 404) return res.status(200).json({ posts: [] })
        if (!res2.ok) throw new Error(`GitHub list failed: ${res2.status}`)
        const files = (await res2.json()) as { name: string; sha: string }[]
        const posts = []
        for (const file of files) {
          if (!file.name.endsWith('.md')) continue
          const contentRes = await ghFetch(`${POSTS_DIR}/${file.name}`)
          if (!contentRes.ok) continue
          const data = await contentRes.json() as { content: string; sha: string }
          const raw = Buffer.from(data.content, 'base64').toString('utf-8')
          posts.push({ name: file.name, sha: data.sha, raw })
        }
        return res.status(200).json({ posts })
      }

      case 'create': {
        if (!slug || !title) return res.status(400).json({ error: 'slug and title required' })
        const path = `${POSTS_DIR}/${slug}.md`
        const existing = await getSha(path)
        if (existing) return res.status(409).json({ error: 'Post already exists' })

        const frontmatter = makeFrontmatter({ title, date, tags: tags || [], excerpt: excerpt || '', published: published ?? true })
        const body = mdContent || ''
        const content = Buffer.from(frontmatter + body, 'utf-8').toString('base64')

        const ghRes = await ghFetch(path, {
          method: 'PUT',
          body: JSON.stringify({
            message: `Create post: ${title}`,
            content,
          }),
        })
        if (!ghRes.ok) throw new Error(`GitHub create failed: ${ghRes.status}`)
        const result = await ghRes.json()
        return res.status(200).json({ ok: true, sha: result.content.sha })
      }

      case 'update': {
        if (!slug) return res.status(400).json({ error: 'slug required' })
        const path = `${POSTS_DIR}/${slug}.md`
        const sha = await getSha(path)
        if (!sha) return res.status(404).json({ error: 'Post not found' })

        const frontmatter = makeFrontmatter({ title, date, tags: tags || [], excerpt: excerpt || '', published: published ?? true })
        const body = mdContent || ''
        const content = Buffer.from(frontmatter + body, 'utf-8').toString('base64')

        const ghRes = await ghFetch(path, {
          method: 'PUT',
          body: JSON.stringify({
            message: `Update post: ${title || slug}`,
            content,
            sha,
          }),
        })
        if (!ghRes.ok) throw new Error(`GitHub update failed: ${ghRes.status}`)
        return res.status(200).json({ ok: true })
      }

      case 'delete': {
        if (!slug) return res.status(400).json({ error: 'slug required' })
        const path = `${POSTS_DIR}/${slug}.md`
        const sha = await getSha(path)
        if (!sha) return res.status(404).json({ error: 'Post not found' })

        const ghRes = await ghFetch(path, {
          method: 'DELETE',
          body: JSON.stringify({
            message: `Delete post: ${slug}`,
            sha,
          }),
        })
        if (!ghRes.ok) throw new Error(`GitHub delete failed: ${ghRes.status}`)
        return res.status(200).json({ ok: true })
      }

      case 'upload-image': {
        if (!filename || !encoding) return res.status(400).json({ error: 'filename and content required' })
        const path = `${IMAGES_DIR}/${filename}`

        const ghRes = await ghFetch(path, {
          method: 'PUT',
          body: JSON.stringify({
            message: `Upload image: ${filename}`,
            content: encoding,
          }),
        })
        if (!ghRes.ok) throw new Error(`GitHub upload failed: ${ghRes.status}`)
        return res.status(200).json({ ok: true, url: `/${IMAGES_DIR}/${filename}` })
      }

      default:
        return res.status(400).json({ error: `Unknown action: ${action}` })
    }
  } catch (e: any) {
    return res.status(500).json({ error: e.message })
  }
}
