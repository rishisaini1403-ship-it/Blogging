import { Link } from 'react-router-dom'
import { SITE } from '../../lib/site'

const social = [
  { label: 'GitHub', href: SITE.github },
  { label: 'LinkedIn', href: SITE.linkedin },
  { label: 'Email', href: `mailto:${SITE.email}` },
]

export default function Footer() {
  return (
    <footer className="mt-32 border-t border-border">
      <div className="max-w-wide mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs font-mono text-subtle">
          © {new Date().getFullYear()} {SITE.name}
        </p>
        <ul className="flex items-center gap-5">
          {social.map((s) => (
            <li key={s.label}>
              <a
                href={s.href}
                target={s.href.startsWith('http') ? '_blank' : undefined}
                rel={s.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="text-xs font-mono text-muted hover:text-text transition-colors"
              >
                {s.label}
              </a>
            </li>
          ))}
          <li>
            <Link to="/about" className="text-xs font-mono text-muted hover:text-text transition-colors">
              About
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  )
}
