import { Link, useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getPostsByTag, getAllTags } from '../lib/posts'
import TagPostRow, { capitalize } from '../components/blog/TagPostRow'
import SEO from '../components/seo/SEO'

const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
}

export default function TagDetail() {
  const { tag = '' } = useParams<{ tag: string }>()
  const navigate = useNavigate()
  const posts = getPostsByTag(tag)
  const allTags = getAllTags()
  const otherTags = allTags.filter((t) => t.tag !== tag)
  const tagLabel = capitalize(tag)
  const countLabel = `${posts.length} ${posts.length === 1 ? 'post' : 'posts'}`

  return (
    <>
      <SEO title={`#${tag}`} path={`/tags/${tag}`} />
      <main className="min-h-screen pt-32 px-6 pb-24">
        <div className="max-w-wide mx-auto">
          <nav aria-label="Breadcrumb" className="font-mono text-xs text-muted mb-6">
            <Link to="/" className="hover:text-text transition-colors duration-150">
              Home
            </Link>
            <span className="mx-2 text-subtle" aria-hidden="true">
              /
            </span>
            <Link to="/tags" className="hover:text-text transition-colors duration-150">
              Tags
            </Link>
            <span className="mx-2 text-subtle" aria-hidden="true">
              /
            </span>
            <span className="text-text">{tagLabel}</span>
          </nav>

          {otherTags.length > 0 && (
            <div className="mb-10 flex flex-wrap gap-2" aria-label="Other tags">
              {otherTags.map(({ tag: t }) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => navigate(`/tags/${t}`)}
                  className="font-mono text-xs px-2.5 py-1 rounded-full border border-border text-muted hover:border-accent hover:text-accent transition-colors duration-150"
                >
                  #{t}
                </button>
              ))}
            </div>
          )}

          <h1 className="font-display text-4xl font-bold text-text mb-3 tracking-tightest">
            {tagLabel}
          </h1>

          <span className="font-mono text-xs text-muted px-2 py-0.5 rounded border border-border bg-surface inline-flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" aria-hidden="true" />
            {countLabel}
          </span>

          {posts.length === 0 ? (
            <div className="mt-24 text-center">
              <p className="font-mono text-sm text-muted">
                No posts tagged #{tag} yet.
              </p>
              <Link
                to="/tags"
                className="inline-block mt-3 font-mono text-xs text-muted hover:text-text transition-colors duration-150"
              >
                ← Browse all tags
              </Link>
            </div>
          ) : (
            <motion.ul
              variants={listVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              className="mt-12"
            >
              {posts.map((post) => (
                <TagPostRow key={post.slug} post={post} />
              ))}
            </motion.ul>
          )}
        </div>
      </main>
    </>
  )
}
