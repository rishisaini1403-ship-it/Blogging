import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { Post } from '../../types/blog'

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' as const } },
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  if (isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

export default function PostListItem({ post, large = false }: { post: Post; large?: boolean }) {
  return (
    <motion.li variants={itemVariants} className="group">
      <Link
        to={`/blog/${post.slug}`}
        onClick={() => sessionStorage.setItem('home-scroll', String(window.scrollY))}
        className="block py-6 px-2 -mx-2 rounded-md transition-colors hover:bg-surface/60"
      >
        <div className="flex items-center gap-3 font-mono text-xs text-muted mb-2">
          <time dateTime={post.meta.date}>{formatDate(post.meta.date)}</time>
          <span className="w-1 h-1 rounded-full bg-border" aria-hidden="true" />
          <span>{post.readingTime}</span>
        </div>

        <h3
          className={`font-display font-semibold text-text group-hover:text-accent transition-colors ${
            large ? 'text-3xl md:text-4xl' : 'text-xl md:text-2xl'
          }`}
        >
          {post.meta.title}
        </h3>

        <p className="mt-2 text-muted leading-relaxed max-w-2xl">{post.meta.excerpt}</p>

        {post.meta.tags.length > 0 && (
          <ul className="mt-3 flex flex-wrap items-center gap-2" aria-label="Tags">
            {post.meta.tags.map((tag) => (
              <li key={tag}>
                <span className="font-mono text-xs text-muted">#{tag}</span>
              </li>
            ))}
          </ul>
        )}
      </Link>
    </motion.li>
  )
}
