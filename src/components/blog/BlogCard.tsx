import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import type { Post } from '../../types/blog'

export default function BlogCard({ post }: { post: Post }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.3 }}
    >
      <Link
        to={`/blog/${post.slug}`}
        onClick={() => sessionStorage.setItem('home-scroll', String(window.scrollY))}
        className="block rounded-xl border border-surface-border bg-surface p-5 transition-all duration-300 hover:-translate-y-1 hover:border-accent/30 hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
      >
        <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
          <time dateTime={post.meta.date}>{post.meta.date}</time>
          <span className="w-1 h-1 rounded-full bg-gray-600" aria-hidden="true" />
          <span>{post.readingTime}</span>
        </div>

        <h3 className="font-semibold text-white mb-1.5">{post.meta.title}</h3>

        <p className="text-sm text-gray-400 leading-relaxed">{post.meta.excerpt}</p>

        {post.meta.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3" aria-label="Tags">
            {post.meta.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-accent/10 text-accent border border-accent/20 leading-5"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </Link>
    </motion.div>
  )
}
