import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { Components } from 'react-markdown'

const components: Components = {
  h1: ({ children }) => <h1 className="text-3xl font-bold mt-12 mb-4 tracking-tightest">{children}</h1>,
  h2: ({ children }) => <h2 className="text-2xl font-semibold mt-12 mb-4 tracking-tight">{children}</h2>,
  h3: ({ children }) => <h3 className="text-xl font-semibold mt-10 mb-3">{children}</h3>,
  h4: ({ children }) => <h4 className="text-lg font-semibold mt-8 mb-2">{children}</h4>,
  p: ({ children }) => <p className="my-5 leading-[1.75] text-text/90">{children}</p>,
  ul: ({ children }) => <ul className="my-5 pl-6 list-disc space-y-2 marker:text-subtle">{children}</ul>,
  ol: ({ children }) => <ol className="my-5 pl-6 list-decimal space-y-2 marker:text-subtle">{children}</ol>,
  li: ({ children }) => <li className="leading-[1.7] text-text/90">{children}</li>,
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-accent underline decoration-accent/30 underline-offset-4 hover:decoration-accent transition-[text-decoration-color]"
    >
      {children}
    </a>
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-6 pl-5 border-l-2 border-accent text-muted italic">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-10 border-border" />,
  code({ className, children, ...props }) {
    const isInline = !className
    if (isInline) {
      return (
        <code
          className="px-1.5 py-0.5 rounded text-[0.875em] font-mono bg-surface border border-border text-text/95"
          {...props}
        >
          {children}
        </code>
      )
    }
    return (
      <code className={`font-mono text-sm ${className ?? ''}`} {...props}>
        {children}
      </code>
    )
  },
  pre: ({ children }) => (
    <pre className="my-6 overflow-x-auto rounded-lg border border-border bg-surface px-4 py-4 text-sm leading-relaxed">
      {children}
    </pre>
  ),
  img: ({ src, alt }) => (
    <img
      src={src}
      alt={alt ?? ''}
      loading="lazy"
      className="my-8 rounded-lg border border-border max-w-full h-auto"
    />
  ),
  table: ({ children }) => (
    <div className="my-6 overflow-x-auto">
      <table className="w-full text-sm border-collapse">{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th className="border border-border px-3 py-2 text-left font-semibold bg-surface text-text">
      {children}
    </th>
  ),
  td: ({ children }) => <td className="border border-border px-3 py-2 text-text/90">{children}</td>,
}

export default function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div className="text-base">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  )
}
