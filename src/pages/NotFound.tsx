import { Link } from 'react-router-dom'
import SEO from '../components/seo/SEO'

export default function NotFound() {
  return (
    <>
      <SEO title="404 — Not found" path="/404" />
      <main className="min-h-screen pt-32 px-6 pb-24 flex items-center">
        <div className="max-w-content mx-auto">
          <p className="font-mono text-xs text-muted mb-6">404</p>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-text mb-3 tracking-tightest">
            That page doesn&apos;t exist.
          </h1>
          <p className="text-muted mb-8">The link may have moved, or it was never here in the first place.</p>
          <Link to="/" className="inline-flex items-center gap-1.5 font-mono text-xs text-accent hover:underline underline-offset-4">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M19 12H5" /><polyline points="12 19 5 12 12 5" />
            </svg>
            Back home
          </Link>
        </div>
      </main>
    </>
  )
}
