import { motion } from 'framer-motion'

const blobs = [
  {
    style: {
      left: '15%',
      top: '10%',
      width: '50vw',
      height: '50vw',
      background: 'radial-gradient(circle, rgba(59,130,246,0.07), transparent 70%)',
    },
    animate: { x: [0, 40, -30, 0], y: [0, -50, 30, 0] },
    transition: { duration: 22, repeat: Infinity, ease: 'easeInOut' as const },
  },
  {
    style: {
      left: '50%',
      top: '30%',
      width: '40vw',
      height: '40vw',
      background: 'radial-gradient(circle, rgba(59,130,246,0.04), transparent 70%)',
    },
    animate: { x: [0, -30, 20, 0], y: [0, 40, -40, 0] },
    transition: { duration: 28, repeat: Infinity, ease: 'easeInOut' as const },
  },
  {
    style: {
      left: '30%',
      top: '60%',
      width: '45vw',
      height: '45vw',
      background: 'radial-gradient(circle, rgba(59,130,246,0.03), transparent 70%)',
    },
    animate: { x: [0, 25, -35, 0], y: [0, -30, 25, 0] },
    transition: { duration: 20, repeat: Infinity, ease: 'easeInOut' as const },
  },
]

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {blobs.map((blob, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full opacity-70"
          style={blob.style}
          animate={blob.animate}
          transition={blob.transition}
        />
      ))}
    </div>
  )
}
