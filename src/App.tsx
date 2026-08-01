import { Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import Nav from './components/layout/Nav'
import Footer from './components/layout/Footer'
import Home from './pages/Home'
import BlogPostPage from './pages/BlogPostPage'
import Tags from './pages/Tags'
import TagDetail from './pages/TagDetail'
import About from './pages/About'
import NotFound from './pages/NotFound'

const AdminPages = lazy(() => import('./pages/AdminPages'))

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-bg">
      <Nav />
      <div className="flex-1">
        <Suspense fallback={<div className="min-h-screen" />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />
            <Route path="/tags" element={<Tags />} />
            <Route path="/tags/:tag" element={<TagDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/admin/*" element={<AdminPages />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </div>
      <Footer />
    </div>
  )
}
