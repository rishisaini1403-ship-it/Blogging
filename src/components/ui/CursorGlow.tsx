import { useEffect, useState } from 'react'

export default function CursorGlow() {
  const [pos, setPos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    let frame: number
    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => setPos({ x: e.clientX, y: e.clientY }))
    }
    window.addEventListener('mousemove', onMove)
    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div
      className="fixed pointer-events-none z-0 w-[400px] h-[400px] rounded-full hidden md:block"
      style={{
        background: 'radial-gradient(circle, rgba(59,130,246,0.04), transparent 70%)',
        left: pos.x - 200,
        top: pos.y - 200,
        transition: 'left 0.3s ease-out, top 0.3s ease-out',
      }}
      aria-hidden="true"
    />
  )
}
