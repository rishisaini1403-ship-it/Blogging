import { Link, useLocation } from 'react-router-dom'

export default function AdminLayout({
  children,
  onLogout,
}: {
  children: React.ReactNode
  onLogout: () => void
}) {
  const { pathname } = useLocation()

  const nav = [
    { label: 'Posts', href: '/admin' },
    { label: 'All posts', href: '/admin/posts' },
  ]

  return (
    <div className="min-h-screen bg-bg">
      <header className="sticky top-0 z-40 border-b border-border bg-bg/85 backdrop-blur-md">
        <div className="max-w-wide mx-auto px-6 h-12 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link
              to="/"
              className="font-mono text-xs text-muted hover:text-text transition-colors duration-150"
            >
              ← Site
            </Link>
            <nav className="flex items-center gap-5 text-sm" aria-label="Admin">
              {nav.map((item) => {
                const isActive =
                  item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href)
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={`transition-colors duration-150 ${
                      isActive ? 'text-text' : 'text-muted hover:text-text'
                    }`}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          </div>
          <button
            type="button"
            onClick={onLogout}
            className="font-mono text-xs text-muted hover:text-red-400 transition-colors duration-150"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-wide mx-auto px-6 py-10">{children}</main>
    </div>
  )
}
