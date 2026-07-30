import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { Components } from 'react-markdown'

const components: Components = {
  code({ className, children, ...props }) {
    const isInline = !className
    if (isInline) {
      return (
        <code
          className="px-1.5 py-0.5 rounded text-[0.85em] bg-surface border border-surface-border font-mono text-[#e0e0e0]"
          {...props}
        >
          {children}
        </code>
      )
    }
    return (
      <pre className="overflow-x-auto rounded-lg border border-surface-border bg-[#111] p-4 my-4 text-sm leading-relaxed">
        <code className={`font-mono text-[#e0e0e0] ${className ?? ''}`} {...props}>
          {children}
        </code>
      </pre>
    )
  },
  pre({ children }) {
    return <>{children}</>
  },
  a({ href, children }) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-accent hover:underline underline-offset-2"
      >
        {children}
      </a>
    )
  },
  blockquote({ children }) {
    return (
      <blockquote className="border-l-2 border-accent/40 pl-4 my-4 text-gray-400 italic">
        {children}
      </blockquote>
    )
  },
  img({ src, alt }) {
    return (
      <img
        src={src}
        alt={alt ?? ''}
        className="rounded-lg my-6 max-w-full border border-surface-border"
      />
    )
  },
  hr() {
    return <hr className="my-8 border-surface-border" />
  },
  table({ children }) {
    return (
      <div className="overflow-x-auto my-4">
        <table className="w-full text-sm border-collapse">{children}</table>
      </div>
    )
  },
  th({ children }) {
    return (
      <th className="border border-surface-border px-3 py-2 text-left font-semibold bg-surface">
        {children}
      </th>
    )
  },
  td({ children }) {
    return <td className="border border-surface-border px-3 py-2">{children}</td>
  },
}

export default function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div className="prose-custom max-w-none [&_p]:mb-4 [&_p]:leading-relaxed [&_p]:text-gray-300 [&_ul]:mb-4 [&_ol]:mb-4 [&_li]:text-gray-300 [&_h1]:text-white [&_h2]:text-white [&_h3]:text-white [&_h2]:mt-8 [&_h2]:mb-3 [&_h3]:mt-6 [&_h3]:mb-2 [&_ul]:pl-5 [&_ol]:pl-5 [&_li]:mb-1">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  )
}
