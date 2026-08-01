import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchAllAdminPosts, type AdminPost } from '../../lib/admin'
import QuickCreateModal from '../../components/admin/QuickCreateModal'

function formatDate(iso: string): string {
  if (!iso) return 'No date'
  const d = new Date(iso)
  if (isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <p className="font-mono text-xs text-muted uppercase tracking-wide">{label}</p>
      <p className="font-display text-2xl font-semibold text-text mt-1">{value}</p>
    </div>
  )
}

export default function Dashboard() {
  const [posts, setPosts] = useState<AdminPost[] | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const newBtnRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    fetchAllAdminPosts()
      .then(setPosts)
      .catch(() => setPosts([]))
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setModalOpen((v) => !v)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  const publishedCount = posts?.filter((p) => p.published).length ?? 0
  const draftCount = posts?.filter((p) => !p.published).length ?? 0
  const tagSet = new Set<string>()
  posts?.forEach((p) => p.tags.forEach((t) => tagSet.add(t)))
  const tagCount = tagSet.size
  const recent = (posts ?? []).slice(0, 5)

  return (
    <>
      <div className="flex items-center justify-between mb-12">
        <div>
          <p className="font-mono text-xs text-muted mb-2">~/admin</p>
          <h1 className="font-display text-3xl font-bold text-text">Posts</h1>
        </div>
        <button
          ref={newBtnRef}
          type="button"
          onClick={() => setModalOpen(true)}
          className="bg-accent text-bg font-medium text-sm px-4 py-2 rounded-md hover:bg-accent/90 transition-colors duration-150 inline-flex items-center gap-2"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New post
        </button>
      </div>

      <section className="mb-12 grid grid-cols-3 gap-6 md:gap-10">
        <Stat label="Published" value={publishedCount} />
        <Stat label="Drafts" value={draftCount} />
        <Stat label="Tags" value={tagCount} />
      </section>

      <section>
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="font-display text-xl font-semibold text-text">Recent</h2>
          <Link
            to="/admin/posts"
            className="font-mono text-xs text-muted hover:text-text transition-colors duration-150"
          >
            View all →
          </Link>
        </div>

        {posts === null ? (
          <p className="font-mono text-sm text-muted">Loading…</p>
        ) : recent.length === 0 ? (
          <p className="font-mono text-sm text-muted">
            No posts yet. Click <span className="text-accent">+ New post</span> to start.
          </p>
        ) : (
          <ul className="border-t border-border">
            {recent.map((p) => (
              <li key={p.slug} className="border-b border-border">
                <Link
                  to={`/admin/posts/${p.slug}/edit`}
                  className="flex items-baseline gap-4 py-4 group"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-lg font-semibold text-text group-hover:text-accent transition-colors duration-150 truncate">
                      {p.title}
                    </h3>
                    <p className="font-mono text-xs text-muted mt-1">
                      {formatDate(p.date)} · {p.tags.map((t) => `#${t}`).join(' ')}
                    </p>
                  </div>
                  {!p.published && (
                    <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 uppercase tracking-wide shrink-0">
                      Draft
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <QuickCreateModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        triggerRef={newBtnRef}
      />
    </>
  )
}
