import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { Post } from '../../types/blog'

const rowVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.22, ease: 'easeOut' as const } },
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  if (isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

function capitalize(s: string): string {
  if (!s) return s
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export default function TagPostRow({ post }: { post: Post }) {
  return (
    <motion.li variants={rowVariants}>
      <Link
        to={`/blog/${post.slug}`}
        onClick={() => sessionStorage.setItem('home-scroll', String(window.scrollY))}
        className="group block py-7 md:py-8 pl-4 -ml-4 pr-2 -mr-2 rounded-md border-l-2 border-l-transparent hover:border-l-accent hover:bg-surface/70 transition-[background-color,border-color] duration-200"
      >
        <div className="font-mono text-xs text-muted mb-1.5">
          <time dateTime={post.meta.date}>{formatDate(post.meta.date)}</time>
          <span className="mx-2 text-subtle">·</span>
          <span>{post.readingTime}</span>
        </div>

        <h3 className="font-display text-2xl font-semibold text-text group-hover:text-accent transition-colors duration-200 leading-snug">
          {post.meta.title}
        </h3>

        <p className="text-sm text-muted mt-2 leading-relaxed max-w-2xl">
          {post.meta.excerpt}
        </p>

        {post.meta.tags.length > 0 && (
          <ul className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-muted">
            {post.meta.tags.map((tag) => (
              <li key={tag} className="hover:text-text transition-colors duration-150">
                #{tag}
              </li>
            ))}
          </ul>
        )}
      </Link>
    </motion.li>
  )
}

export { capitalize }
