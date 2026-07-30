import { motion } from 'framer-motion'
import { getAllPosts } from '../../lib/posts'
import BlogCard from '../blog/BlogCard'

const posts = getAllPosts()

export default function BlogSection() {
  return (
    <section id="blog" className="mb-28">
      <h2 className="text-sm font-semibold text-accent uppercase tracking-widest mb-6">
        Blog
      </h2>

      {posts.length === 0 ? (
        <p className="text-sm text-gray-500 italic">No posts yet.</p>
      ) : (
        <motion.div
          className="space-y-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-30px' }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.07 } },
          }}
        >
          {posts.map((post, i) => (
            <motion.div
              key={post.slug}
              variants={{
                hidden: { opacity: 0, y: 16 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
              }}
            >
              <BlogCard post={post} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </section>
  )
}
