import { useEffect, useState } from 'react'
import { Routes, Route, Navigate, useParams } from 'react-router-dom'
import { useAdminAuth } from '../hooks/useAdminAuth'
import { fetchAllAdminPosts, type AdminPost } from '../lib/admin'
import AdminLayout from '../components/admin/AdminLayout'
import LoginPage from '../components/admin/LoginPage'
import PostList from '../components/admin/PostList'
import PostEditor from '../components/admin/PostEditor'

function AdminGate({ children }: { children: React.ReactNode }) {
  const { authed, loading, login, logout } = useAdminAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <p className="text-sm text-gray-500">Checking session...</p>
      </div>
    )
  }

  if (!authed) {
    return <LoginPage onLogin={login} />
  }

  return <AdminLayout onLogout={logout}>{children}</AdminLayout>
}

function PostListPage() {
  return (
    <div>
      <h1 className="text-lg font-semibold text-white mb-6">Posts</h1>
      <PostList />
    </div>
  )
}

function NewPostPage() {
  return (
    <div>
      <h1 className="text-lg font-semibold text-white mb-6">New Post</h1>
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
    return <p className="text-sm text-gray-500">Loading post...</p>
  }

  if (post === null) {
    return (
      <div>
        <p className="text-sm text-gray-500 mb-4">Post not found.</p>
        <a href="/admin/posts" className="text-sm text-accent hover:underline">&larr; Back to posts</a>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-lg font-semibold text-white mb-6">Edit: {post.title}</h1>
      <PostEditor existing={post} />
    </div>
  )
}

export default function AdminPages() {
  return (
    <AdminGate>
      <Routes>
        <Route index element={<Navigate to="posts" replace />} />
        <Route path="posts" element={<PostListPage />} />
        <Route path="posts/new" element={<NewPostPage />} />
        <Route path="posts/:slug/edit" element={<EditPostPage />} />
      </Routes>
    </AdminGate>
  )
}
