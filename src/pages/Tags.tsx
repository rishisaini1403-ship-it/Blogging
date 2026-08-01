import { Link } from 'react-router-dom'
import { getAllTags } from '../lib/posts'
import SEO from '../components/seo/SEO'

export default function Tags() {
  const tags = getAllTags()

  return (
    <>
      <SEO title="Tags" path="/tags" />
      <main className="min-h-screen pt-32 px-6 pb-24">
        <div className="max-w-content mx-auto">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-text mb-3 tracking-tightest">Tags</h1>
          <p className="text-muted mb-10">Every tag used across the writing, with post counts.</p>

          {tags.length === 0 ? (
            <p className="text-muted italic">No tags yet.</p>
          ) : (
            <ul className="flex flex-wrap gap-2">
              {tags.map(({ tag, count }) => (
                <li key={tag}>
                  <Link
                    to={`/tags/${tag}`}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-border bg-surface/50 hover:bg-surface hover:border-accent/40 transition-colors"
                  >
                    <span className="font-mono text-sm text-text">#{tag}</span>
                    <span className="font-mono text-xs text-muted">{count}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </>
  )
}
