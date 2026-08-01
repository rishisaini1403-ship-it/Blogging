import SEO from '../components/seo/SEO'
import { SITE } from '../lib/site'

export default function About() {
  return (
    <>
      <SEO title="About" path="/about" />
      <main className="min-h-screen pt-32 px-6 pb-24">
        <article className="max-w-content mx-auto">
          <div className="mb-12">
            <div className="inline-flex items-center justify-center w-28 h-28 rounded-2xl bg-surface border border-border mb-8">
              <span className="font-display text-5xl font-bold text-accent">H</span>
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-text mb-3 tracking-tightest">About</h1>
            <p className="font-mono text-xs text-muted">A short note about who&apos;s writing.</p>
          </div>

          <div className="space-y-5 text-base leading-[1.75] text-text/90">
            <p>
              I&apos;m <strong className="font-semibold text-text">Harish</strong>, a developer who likes
              building things that are small, considered, and finished.
            </p>
            <p>
              I work mostly on the web — React, TypeScript, Node — and I write here about
              the things I learn while building: system design choices that age well, debugging
              stories from production, and the quieter craft decisions that never make it into
              a commit message.
            </p>
            <p>
              When I&apos;m not coding I read, take notes on whatever I&apos;m reading, and try to keep my
              tools minimal. This site is part of that.
            </p>
          </div>

          <section className="mt-16">
            <h2 className="font-display text-xl font-semibold text-text mb-4">What I write about</h2>
            <ul className="space-y-2 text-muted">
              <li>· Web development, mostly React and TypeScript</li>
              <li>· System design and architecture notes</li>
              <li>· Debugging and observability</li>
              <li>· Tools, productivity, and minimalism</li>
              <li>· The occasional essay on something else entirely</li>
            </ul>
          </section>

          <section className="mt-16">
            <h2 className="font-display text-xl font-semibold text-text mb-4">Elsewhere</h2>
            <ul className="space-y-2 font-mono text-sm">
              <li>
                <span className="text-muted">github </span>
                <a href={SITE.github} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline underline-offset-4">
                  {SITE.github.replace('https://', '')}
                </a>
              </li>
              <li>
                <span className="text-muted">linkedin </span>
                <a href={SITE.linkedin} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline underline-offset-4">
                  {SITE.linkedin.replace('https://www.', '')}
                </a>
              </li>
              <li>
                <span className="text-muted">email </span>
                <a href={`mailto:${SITE.email}`} className="text-accent hover:underline underline-offset-4">{SITE.email}</a>
              </li>
            </ul>
          </section>
        </article>
      </main>
    </>
  )
}
