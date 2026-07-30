import { motion } from 'framer-motion'
import { skills } from '../../data/skills'

function LevelDots({ level }: { level: number }) {
  return (
    <div className="flex gap-[3px]">
      {[1, 2, 3, 4].map((dot) => (
        <span
          key={dot}
          className={`w-[7px] h-[7px] rounded-full transition-colors duration-300 ${
            dot <= level ? 'bg-accent' : 'bg-surface-border'
          }`}
        />
      ))}
    </div>
  )
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.04 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
}

export default function Skills() {
  return (
    <section id="skills" className="mb-28">
      <h2 className="text-sm font-semibold text-accent uppercase tracking-widest mb-6">
        Skills
      </h2>

      <motion.div
        className="grid grid-cols-2 sm:grid-cols-3 gap-3"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-30px' }}
      >
        {skills.map((skill) => (
          <motion.div
            key={skill.name}
            variants={itemVariants}
            className="rounded-xl border border-surface-border bg-surface p-4 transition-all duration-300 hover:-translate-y-1 hover:border-accent/30 hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)]"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-sm text-white">{skill.name}</span>
              <span className="text-[10px] text-gray-600 uppercase tracking-wide">
                {skill.category}
              </span>
            </div>
            <LevelDots level={skill.level} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
