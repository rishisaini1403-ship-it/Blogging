import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'

interface Props {
  open: boolean
  onClose: () => void
  triggerRef?: React.RefObject<HTMLButtonElement | null>
}

export default function QuickCreateModal({ open, onClose, triggerRef }: Props) {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [tags, setTags] = useState('')
  const titleRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setTitle('')
      setTags('')
      const t = window.setTimeout(() => titleRef.current?.focus(), 30)
      return () => window.clearTimeout(t)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (title.trim()) params.set('title', title.trim())
    if (tags.trim()) params.set('tags', tags.trim())
    const qs = params.toString()
    navigate(`/admin/posts/new${qs ? `?${qs}` : ''}`)
  }

  const handleClose = () => {
    onClose()
    requestAnimationFrame(() => triggerRef?.current?.focus())
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 bg-bg/70 backdrop-blur-sm"
            onClick={handleClose}
            aria-hidden="true"
          />
          <div
            key="portal"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.15 }}
              className="bg-surface border border-border rounded-xl max-w-md w-full p-6 pointer-events-auto"
              role="dialog"
              aria-modal="true"
              aria-labelledby="qc-title"
            >
              <h2
                id="qc-title"
                className="font-display text-2xl font-semibold text-text mb-1"
              >
                New post
              </h2>
              <p className="font-mono text-xs text-muted mb-6">
                Start a draft — you can edit everything else later.
              </p>

              <form onSubmit={submit}>
                <label className="block mb-4">
                  <span className="block font-mono text-xs text-muted mb-1.5">Title</span>
                  <input
                    ref={titleRef}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-md bg-bg border border-border text-text text-base font-display focus:outline-none focus:border-accent transition-colors duration-150"
                    placeholder="A working title"
                  />
                </label>

                <label className="block mb-6">
                  <span className="block font-mono text-xs text-muted mb-1.5">
                    Tags <span className="text-subtle">(comma-separated)</span>
                  </span>
                  <input
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    className="w-full px-3 py-2 rounded-md bg-bg border border-border text-text font-mono text-sm focus:outline-none focus:border-accent transition-colors duration-150"
                    placeholder="react, typescript"
                  />
                </label>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="px-4 py-2 rounded-md font-mono text-xs text-muted hover:text-text transition-colors duration-150"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-accent text-bg font-medium text-sm px-4 py-2 rounded-md hover:bg-accent/90 transition-colors duration-150 inline-flex items-center gap-1.5"
                  >
                    Start writing →
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
