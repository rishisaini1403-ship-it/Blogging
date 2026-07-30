import { motion } from 'framer-motion'
import { experiences } from '../../data/experience'

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, x: -16 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.35 } },
}

export default function Experience() {
  return (
    <section id="experience" className="mb-28">
      <h2 className="text-sm font-semibold text-accent uppercase tracking-widest mb-6">
        Experience
      </h2>

      <motion.div
        className="relative"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-30px' }}
      >
        {/* Vertical line */}
        <div className="absolute left-[7px] top-2 bottom-2 w-px bg-surface-border hidden md:block" />

        <div className="space-y-10">
          {experiences.map((exp) => (
            <motion.div
              key={exp.company + exp.role}
              variants={itemVariants}
              className="relative md:pl-8"
            >
              {/* Timeline dot */}
              <div className="hidden md:block absolute left-[-5px] top-1.5 w-[15px] h-[15px] rounded-full bg-[#0a0a0a] border-2 border-accent" />

              <div className="text-xs text-gray-500 mb-1.5 font-mono">
                {exp.period}
              </div>

              <h3 className="font-semibold text-white">{exp.role}</h3>
              <p className="text-sm text-accent mb-2">{exp.company}</p>
              <p className="text-sm text-gray-400 leading-relaxed mb-3">
                {exp.description}
              </p>

              <ul className="space-y-1.5">
                {exp.highlights.map((h, i) => (
                  <li key={i} className="text-sm text-gray-500 flex gap-2">
                    <span className="text-accent/60 mt-1.5 shrink-0">
                      <svg width="4" height="4" viewBox="0 0 4 4" fill="currentColor">
                        <circle cx="2" cy="2" r="2" />
                      </svg>
                    </span>
                    {h}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
