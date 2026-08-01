import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getPost, getAdjacentPosts } from '../lib/posts'
import MarkdownRenderer from '../components/blog/MarkdownRenderer'
import SEO from '../components/seo/SEO'

function formatDate(iso: string): string {
  const d = new Date(iso)
  if (isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>()
  const post = slug ? getPost(slug) : undefined
  const { prev, next } = slug ? getAdjacentPosts(slug) : { prev: null, next: null }

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  if (!post) {
    return (
      <>
        <SEO title="Post not found" path="/blog/not-found" />
        <main className="min-h-screen pt-32 px-6">
          <div className="max-w-content mx-auto">
            <h1 className="font-display text-3xl font-bold text-text mb-3">Post not found</h1>
            <p className="text-muted mb-6">The post you&apos;re looking for doesn&apos;t exist or has been removed.</p>
            <Link to="/" className="text-accent hover:underline underline-offset-4">← Back home</Link>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <SEO
        title={post.meta.title}
        description={post.meta.excerpt}
        path={`/blog/${post.slug}`}
        type="article"
      />
      <main className="min-h-screen pt-32 pb-16 px-6">
        <article className="max-w-content mx-auto">
          <header className="mb-10">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 font-mono text-xs text-muted hover:text-text transition-colors mb-8"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M19 12H5" /><polyline points="12 19 5 12 12 5" />
              </svg>
              Writing
            </Link>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-text leading-[1.1] tracking-tightest mb-4 text-balance">
              {post.meta.title}
            </h1>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-muted">
              <time dateTime={post.meta.date}>{formatDate(post.meta.date)}</time>
              <span className="w-1 h-1 rounded-full bg-border" aria-hidden="true" />
              <span>{post.readingTime}</span>
              {post.meta.tags.length > 0 && (
                <>
                  <span className="w-1 h-1 rounded-full bg-border" aria-hidden="true" />
                  <ul className="inline-flex items-center gap-2">
                    {post.meta.tags.map((tag) => (
                      <li key={tag}>
                        <Link to={`/tags/${tag}`} className="hover:text-text transition-colors">
                          #{tag}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </header>

          <div className="border-t border-border pt-10">
            <MarkdownRenderer content={post.content} />
          </div>

          <nav className="mt-20 pt-8 border-t border-border grid grid-cols-1 sm:grid-cols-2 gap-6" aria-label="Post navigation">
            {prev ? (
              <Link to={`/blog/${prev.slug}`} className="group">
                <span className="block font-mono text-xs text-muted mb-1">← Previous</span>
                <span className="block font-display font-semibold text-text group-hover:text-accent transition-colors">
                  {prev.meta.title}
                </span>
              </Link>
            ) : <span />}
            {next ? (
              <Link to={`/blog/${next.slug}`} className="group sm:text-right">
                <span className="block font-mono text-xs text-muted mb-1">Next →</span>
                <span className="block font-display font-semibold text-text group-hover:text-accent transition-colors">
                  {next.meta.title}
                </span>
              </Link>
            ) : <span />}
          </nav>
        </article>
      </main>
    </>
  )
}
