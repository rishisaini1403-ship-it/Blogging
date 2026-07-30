import { motion } from 'framer-motion'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  as?: 'div' | 'a'
  href?: string
}

export default function Card({
  children,
  className = '',
  hover = true,
  as = 'div',
  href,
}: CardProps) {
  const base = `rounded-xl border border-surface-border bg-surface ${className}`
  const hoverClasses = hover
    ? 'transition-all duration-300 hover:-translate-y-1 hover:border-accent/30 hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)]'
    : ''

  if (as === 'a' && href) {
    return (
      <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`block ${base} ${hoverClasses}`}
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-30px' }}
        transition={{ duration: 0.35 }}
      >
        {children}
      </motion.a>
    )
  }

  return (
    <motion.div
      className={`${base} ${hoverClasses}`}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.35 }}
    >
      {children}
    </motion.div>
  )
}
