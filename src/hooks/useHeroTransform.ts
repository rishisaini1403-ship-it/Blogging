import { useScroll, useTransform, useSpring } from 'framer-motion'

export function useHeroTransform() {
  const { scrollY } = useScroll()

  const raw = useTransform(scrollY, [0, 400], [0, 1])
  const progress = useSpring(raw, {
    stiffness: 80,
    damping: 25,
    restDelta: 0.001,
  })

  const sidebarWidth = useTransform(progress, [0, 1], ['100vw', '300px'])
  const sidebarRadius = useTransform(progress, [0, 1], ['0px', '0px 16px 16px 0px'])

  const contentMarginLeft = useTransform(progress, [0, 1], ['0px', '300px'])
  const contentPaddingLeft = useTransform(progress, [0, 1], ['0px', '3.5rem'])

  const nameScale = useTransform(progress, [0, 1], [1, 0.4])
  const taglineOpacity = useTransform(progress, [0, 0.6], [1, 0])
  const buttonsOpacity = useTransform(progress, [0, 0.5], [1, 0])
  const scrollHintOpacity = useTransform(progress, [0, 0.2], [1, 0])

  return {
    progress,
    sidebarWidth,
    sidebarRadius,
    contentMarginLeft,
    contentPaddingLeft,
    nameScale,
    taglineOpacity,
    buttonsOpacity,
    scrollHintOpacity,
  }
}
