import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Shell from './components/layout/Shell'
import BlogPostPage from './pages/BlogPostPage'

const AdminPages = lazy(() => import('./pages/AdminPages'))

export default function App() {
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route path="/" element={<Shell />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />
        <Route path="/admin/*" element={<AdminPages />} />
      </Routes>
    </Suspense>
  )
}
