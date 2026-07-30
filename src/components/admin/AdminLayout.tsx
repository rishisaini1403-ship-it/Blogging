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
    { label: 'Posts', href: '/admin/posts' },
    { label: 'New Post', href: '/admin/posts/new' },
  ]

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <header className="sticky top-0 z-40 border-b border-surface-border bg-[#0a0a0a]/90 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-6 h-12 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="text-xs text-gray-500 hover:text-accent transition-colors">
              &larr; Site
            </Link>
            <nav className="flex items-center gap-4 text-sm">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`transition-colors ${
                    pathname === item.href
                      ? 'text-white font-medium'
                      : 'text-gray-500 hover:text-white'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <button
            onClick={onLogout}
            className="text-xs text-gray-500 hover:text-red-400 transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">{children}</main>
    </div>
  )
}
