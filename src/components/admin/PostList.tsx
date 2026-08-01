import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchAllAdminPosts, deleteAdminPost, type AdminPost } from '../../lib/admin'

function formatDate(iso: string): string {
  if (!iso) return 'No date'
  const d = new Date(iso)
  if (isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

export default function PostList() {
  const [posts, setPosts] = useState<AdminPost[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterPublished, setFilterPublished] = useState<'all' | 'published' | 'draft'>('all')

  const load = async () => {
    setLoading(true)
    try {
      const p = await fetchAllAdminPosts()
      setPosts(p)
    } catch {
      setPosts([])
    }
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  const filtered = posts.filter((p) => {
    const q = search.toLowerCase()
    if (q && !p.title.toLowerCase().includes(q) && !p.slug.toLowerCase().includes(q)) return false
    if (filterPublished === 'published' && !p.published) return false
    if (filterPublished === 'draft' && p.published) return false
    return true
  })

  const handleDelete = async (slug: string, title: string) => {
    if (!window.confirm(`Delete "${title}"?`)) return
    try {
      await deleteAdminPost(slug)
      setPosts((prev) => prev.filter((p) => p.slug !== slug))
    } catch {
      alert('Delete failed')
    }
  }

  if (loading) {
    return <p className="font-mono text-sm text-muted">Loading posts…</p>
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Search posts…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-3 py-2 rounded-md bg-bg border border-border text-text placeholder-subtle text-sm font-mono focus:outline-none focus:border-accent transition-colors duration-150"
        />
        <select
          value={filterPublished}
          onChange={(e) => setFilterPublished(e.target.value as typeof filterPublished)}
          className="px-3 py-2 rounded-md bg-bg border border-border text-text text-sm font-mono focus:outline-none focus:border-accent transition-colors duration-150"
        >
          <option value="all">All</option>
          <option value="published">Published</option>
          <option value="draft">Drafts</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="font-mono text-sm text-muted">No posts found.</p>
      ) : (
        <ul className="border-t border-border">
          {filtered.map((post) => (
            <li
              key={post.slug}
              className="flex items-center gap-4 py-4 border-b border-border"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <Link
                    to={`/admin/posts/${post.slug}/edit`}
                    className="font-display text-base font-semibold text-text hover:text-accent transition-colors duration-150 truncate"
                  >
                    {post.title}
                  </Link>
                  {!post.published && (
                    <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 uppercase tracking-wide">
                      Draft
                    </span>
                  )}
                </div>
                <p className="font-mono text-xs text-muted mt-1">
                  {post.slug} · {formatDate(post.date)}
                </p>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <Link
                  to={`/admin/posts/${post.slug}/edit`}
                  className="font-mono text-xs text-muted hover:text-text transition-colors duration-150"
                >
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={() => handleDelete(post.slug, post.title)}
                  className="font-mono text-xs text-muted hover:text-red-400 transition-colors duration-150"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
