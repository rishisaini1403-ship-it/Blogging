import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchAllAdminPosts, deleteAdminPost, type AdminPost } from '../../lib/admin'

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

  useEffect(() => { load() }, [])

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
    return <p className="text-sm text-gray-500">Loading posts...</p>
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Search posts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-3 py-2 rounded-lg border border-surface-border bg-surface text-white placeholder-gray-500 text-sm focus:outline-none focus:border-accent"
        />
        <select
          value={filterPublished}
          onChange={(e) => setFilterPublished(e.target.value as typeof filterPublished)}
          className="px-3 py-2 rounded-lg border border-surface-border bg-surface text-white text-sm focus:outline-none focus:border-accent"
        >
          <option value="all">All</option>
          <option value="published">Published</option>
          <option value="draft">Drafts</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-gray-500">No posts found.</p>
      ) : (
        <div className="space-y-2">
          {filtered.map((post) => (
            <div
              key={post.slug}
              className="flex items-center gap-4 px-4 py-3 rounded-lg border border-surface-border bg-surface"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <Link
                    to={`/admin/posts/${post.slug}/edit`}
                    className="text-sm font-medium text-white hover:text-accent transition-colors truncate"
                  >
                    {post.title}
                  </Link>
                  {!post.published && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 leading-normal">
                      Draft
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  {post.slug} &middot; {post.date || 'No date'}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Link
                  to={`/admin/posts/${post.slug}/edit`}
                  className="text-xs text-gray-500 hover:text-accent transition-colors"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(post.slug, post.title)}
                  className="text-xs text-gray-500 hover:text-red-400 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
