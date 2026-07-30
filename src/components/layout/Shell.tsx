import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useHeroTransform } from '../../hooks/useHeroTransform'
import { useWindowSize } from '../../hooks/useWindowSize'
import Header from './Header'
import Footer from './Footer'
import AnimatedBackground from '../hero/AnimatedBackground'
import SocialLinks from '../hero/SocialLinks'
import About from '../sections/About'
import Skills from '../sections/Skills'
import Projects from '../sections/Projects'
import Experience from '../sections/Experience'
import BlogSection from '../sections/BlogSection'
import BackToTop from '../ui/BackToTop'
import CursorGlow from '../ui/CursorGlow'

function DesktopShell() {
  const {
    sidebarWidth,
    sidebarRadius,
    contentMarginLeft,
    contentPaddingLeft,
    nameScale,
    taglineOpacity,
    buttonsOpacity,
    scrollHintOpacity,
  } = useHeroTransform()

  return (
    <div className="min-h-screen">
      <AnimatedBackground />
      <CursorGlow />

      <div className="h-screen" />

      <motion.aside
        className="fixed top-0 left-0 h-screen z-30 flex flex-col justify-center overflow-hidden bg-[#0a0a0a]"
        style={{ width: sidebarWidth, borderRadius: sidebarRadius }}
      >
        <div className="px-10 md:px-14">
          <motion.h1
            className="font-bold text-white whitespace-nowrap origin-left"
            style={{
              fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
              scale: nameScale,
            }}
          >
            Harish
          </motion.h1>

          <motion.p
            className="text-[#888] mt-3 text-base"
            style={{ opacity: taglineOpacity }}
          >
            Developer. Writer. Lifelong learner.
          </motion.p>

          <motion.div
            className="mt-7"
            style={{ opacity: buttonsOpacity }}
          >
            <SocialLinks />
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          style={{ opacity: scrollHintOpacity }}
          aria-hidden="true"
        >
          <div className="w-1 h-8 rounded-full bg-accent/40 animate-bounce" />
        </motion.div>
      </motion.aside>

      <motion.main
        className="relative z-20 min-h-screen"
        role="main"
        style={{
          marginLeft: contentMarginLeft,
          paddingLeft: contentPaddingLeft,
          paddingRight: '1.5rem',
        }}
      >
        <div className="max-w-content mx-auto py-24 px-6 md:px-8">
          <About />
          <Skills />
          <Projects />
          <Experience />
          <BlogSection />
        </div>
        <Footer />
      </motion.main>

      <BackToTop />
    </div>
  )
}

function MobileShell() {
  return (
    <div className="min-h-screen">
      <Header />
      <AnimatedBackground />

      <div className="pt-20 pb-12 px-6 max-w-content mx-auto">
        <div className="mb-16 text-center">
          <h1 className="text-4xl font-bold mb-2">Harish</h1>
          <p className="text-[#888]">Developer. Writer. Lifelong learner.</p>
          <div className="mt-4 flex justify-center">
            <SocialLinks />
          </div>
        </div>

        <About />
        <Skills />
        <Projects />
        <Experience />
        <BlogSection />
      </div>

      <Footer />
      <BackToTop />
    </div>
  )
}

export default function Shell() {
  const { width } = useWindowSize()
  const isMobile = width < 768

  useEffect(() => {
    const saved = sessionStorage.getItem('home-scroll')
    if (saved) {
      requestAnimationFrame(() => window.scrollTo(0, parseInt(saved, 10)))
      sessionStorage.removeItem('home-scroll')
    }
  }, [])

  return isMobile ? <MobileShell /> : <DesktopShell />
}
