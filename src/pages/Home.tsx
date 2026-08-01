import { motion } from 'framer-motion'
import { getAllPosts } from '../lib/posts'
import PostListItem from '../components/blog/PostListItem'
import SEO from '../components/seo/SEO'

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } },
}

export default function Home() {
  const posts = getAllPosts()
  const latest = posts[0]
  const rest = posts.slice(1)

  return (
    <>
      <SEO path="/" />

      <main className="min-h-screen pt-14">
        <section className="max-w-wide mx-auto px-6 pt-24 md:pt-32 pb-16">
          <div className="max-w-2xl">
            <p className="font-mono text-xs text-muted mb-6 tracking-wide">~/</p>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-text leading-[1.05] tracking-tightest mb-6">
              Hi, I&apos;m Harish.
            </h1>
            <p className="text-lg text-muted leading-relaxed">
              I&apos;m a developer writing about web development, system design, and the
              things I learn while building. Occasionally about philosophy, reading,
              and minimalist design.
            </p>
          </div>
        </section>

        {posts.length === 0 ? (
          <section className="max-w-wide mx-auto px-6 py-24">
            <p className="text-muted italic">No posts yet.</p>
          </section>
        ) : (
          <section className="max-w-wide mx-auto px-6 pb-24">
            <div className="border-t border-border" />

            {latest && (
              <motion.ul
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <PostListItem post={latest} large />
                {rest.length > 0 && <li className="border-t border-border" />}
                {rest.map((post) => (
                  <div key={post.slug}>
                    <PostListItem post={post} />
                    <div className="border-t border-border" />
                  </div>
                ))}
              </motion.ul>
            )}
          </section>
        )}
      </main>
    </>
  )
}
