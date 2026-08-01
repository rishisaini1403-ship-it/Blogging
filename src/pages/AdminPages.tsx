import { useEffect, useState } from 'react'
import { Routes, Route, Navigate, useParams, Link } from 'react-router-dom'
import { useAdminAuth } from '../hooks/useAdminAuth'
import { fetchAllAdminPosts, type AdminPost } from '../lib/admin'
import AdminLayout from '../components/admin/AdminLayout'
import LoginPage from '../components/admin/LoginPage'
import PostList from '../components/admin/PostList'
import PostEditor from '../components/admin/PostEditor'
import Dashboard from './admin/Dashboard'

function AdminGate({ children }: { children: React.ReactNode }) {
  const { authed, loading, login, logout } = useAdminAuth()

  if (loading) {
    return (
      <main className="min-h-screen bg-bg flex items-center justify-center">
        <p className="font-mono text-sm text-muted">Checking session…</p>
      </main>
    )
  }

  if (!authed) {
    return <LoginPage onLogin={login} />
  }

  return <AdminLayout onLogout={logout}>{children}</AdminLayout>
}

function PostsPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-text mb-6">All posts</h1>
      <PostList />
    </div>
  )
}

function NewPostPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-text mb-6">New post</h1>
      <PostEditor />
    </div>
  )
}

function EditPostPage() {
  const { slug } = useParams<{ slug: string }>()
  const [post, setPost] = useState<AdminPost | null | undefined>(undefined)

  useEffect(() => {
    if (!slug) return
    fetchAllAdminPosts()
      .then((posts) => setPost(posts.find((p) => p.slug === slug) ?? null))
      .catch(() => setPost(null))
  }, [slug])

  if (post === undefined) {
    return <p className="font-mono text-sm text-muted">Loading post…</p>
  }

  if (post === null) {
    return (
      <div>
        <p className="font-mono text-sm text-muted mb-4">Post not found.</p>
        <Link
          to="/admin/posts"
          className="font-mono text-sm text-accent hover:underline underline-offset-4"
        >
          ← Back to posts
        </Link>
      </div>
    )
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-text mb-6">Edit: {post.title}</h1>
      <PostEditor existing={post} />
    </div>
  )
}

export default function AdminPages() {
  return (
    <AdminGate>
      <Routes>
        <Route index element={<Dashboard />} />
        <Route path="posts" element={<PostsPage />} />
        <Route path="posts/new" element={<NewPostPage />} />
        <Route path="posts/:slug/edit" element={<EditPostPage />} />
        <Route path="*" element={<Navigate to="" replace />} />
      </Routes>
    </AdminGate>
  )
}
