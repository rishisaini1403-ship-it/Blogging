import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, useScroll } from 'framer-motion'
import { getPost } from '../lib/posts'
import MarkdownRenderer from '../components/blog/MarkdownRenderer'

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>()
  const post = slug ? getPost(slug) : undefined
  const { scrollYProgress } = useScroll()

  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = post ? `${post.meta.title} — Harish` : 'Harish — Developer'
  }, [slug, post])

  if (!post) {
    return (
      <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-lg font-semibold text-white mb-2">Post not found</h1>
          <p className="text-sm text-gray-400 mb-4">
            The post you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Link to="/" className="text-sm text-accent hover:underline">
            &larr; Back home
          </Link>
        </div>
      </main>
    )
  }

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 right-0 h-0.5 bg-accent z-50 origin-left"
        style={{ scaleX: scrollYProgress }}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Reading progress"
      />

      <main className="min-h-screen bg-[#0a0a0a]">
        <article className="max-w-content mx-auto px-6 py-16 md:py-24">
          <nav aria-label="Breadcrumb">
            <Link
              to="/"
              className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-accent transition-colors mb-10"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M19 12H5" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              Back to all posts
            </Link>
          </nav>

          <header>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 leading-tight">
              {post.meta.title}
            </h1>

            <div className="flex items-center gap-3 text-sm text-gray-500" aria-label="Post metadata">
              <time dateTime={post.meta.date}>{post.meta.date}</time>
              <span className="w-1 h-1 rounded-full bg-gray-600" aria-hidden="true" />
              <span>{post.readingTime}</span>
            </div>

            {post.meta.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3" role="list" aria-label="Tags">
                {post.meta.tags.map((tag) => (
                  <span
                    key={tag}
                    role="listitem"
                    className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-accent/10 text-accent border border-accent/20 leading-5"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </header>

          <div className="border-t border-surface-border pt-8 mt-8">
            <MarkdownRenderer content={post.content} />
          </div>

          <footer className="mt-16 pt-8 border-t border-surface-border">
            <Link
              to="/"
              className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-accent transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M19 12H5" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              Back to all posts
            </Link>
          </footer>
        </article>
      </main>
    </>
  )
}
