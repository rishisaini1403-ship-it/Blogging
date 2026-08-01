import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'

const links = [
  { to: '/', label: 'Writing' },
  { to: '/about', label: 'About' },
  { to: '/tags', label: 'Tags' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    let frame = 0
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => setScrolled(window.scrollY > 4))
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-200 ${
        scrolled || open
          ? 'bg-bg/75 backdrop-blur-md border-b border-border'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-wide mx-auto px-6 h-14 flex items-center justify-between">
        <Link
          to="/"
          className="font-display text-lg font-semibold text-text hover:text-accent transition-colors"
        >
          {`{ Harish }`}
        </Link>

        <nav className="hidden md:flex items-center gap-7" aria-label="Primary">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) =>
                `text-sm transition-colors ${
                  isActive ? 'text-text' : 'text-muted hover:text-text'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="md:hidden p-2 -mr-2 text-muted hover:text-text transition-colors"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            {open ? <path d="M18 6 6 18M6 6l12 12" /> : <path d="M3 12h18M3 6h18M3 18h18" />}
          </svg>
        </button>
      </div>

      {open && (
        <nav className="md:hidden border-t border-border bg-bg/95 backdrop-blur-md" aria-label="Mobile">
          <ul className="max-w-wide mx-auto px-6 py-3 flex flex-col gap-1">
            {links.map((l) => (
              <li key={l.to}>
                <NavLink
                  to={l.to}
                  end={l.to === '/'}
                  className={({ isActive }) =>
                    `block py-2 text-sm transition-colors ${
                      isActive ? 'text-text' : 'text-muted hover:text-text'
                    }`
                  }
                >
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  )
}
