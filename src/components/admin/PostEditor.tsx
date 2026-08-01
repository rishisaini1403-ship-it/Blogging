import { useEffect, useState, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { createAdminPost, updateAdminPost, type AdminPost } from '../../lib/admin'
import MarkdownRenderer from '../blog/MarkdownRenderer'

const schema = z.object({
  title: z.string().min(1, 'Title required'),
  slug: z.string().min(1, 'Slug required').regex(/^[a-z0-9-]+$/, 'Only lowercase, numbers, hyphens'),
  date: z.string().min(1, 'Date required'),
  tags: z.string(),
  excerpt: z.string().max(300, 'Max 300 characters'),
  published: z.boolean(),
})

type Form = z.infer<typeof schema>

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

const DRAFT_KEY = 'admin-editor-draft'

export default function PostEditor({ existing }: { existing?: AdminPost | null }) {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const isEdit = !!existing
  const [md, setMd] = useState(existing?.content || '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const prefillTitle = searchParams.get('title') || ''
  const prefillTags = searchParams.get('tags') || ''

  const form = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: existing
      ? {
          title: existing.title,
          slug: existing.slug,
          date: existing.date,
          tags: existing.tags.join(', '),
          excerpt: existing.excerpt,
          published: existing.published,
        }
      : {
          title: prefillTitle,
          slug: prefillTitle ? slugify(prefillTitle) : '',
          date: new Date().toISOString().slice(0, 10),
          tags: prefillTags,
          excerpt: '',
          published: true,
        },
  })

  const { register, handleSubmit, setValue, watch, formState: { errors, isDirty } } = form
  const title = watch('title')
  const slug = watch('slug')

  useEffect(() => {
    if (!isEdit && title && !slug) {
      setValue('slug', slugify(title))
    }
  }, [title, slug, isEdit, setValue])

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isDirty && !md) return
      const data = { ...form.getValues(), md }
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify(data))
    }, 30000)
    return () => clearInterval(interval)
  }, [form, md, isDirty])

  const submit = useCallback(
    async (data: Form) => {
      setSaving(true)
      setError('')
      try {
        const payload = {
          slug: data.slug,
          title: data.title,
          date: data.date,
          tags: data.tags.split(',').map((t) => t.trim()).filter(Boolean),
          excerpt: data.excerpt,
          published: data.published,
          content: md,
        }
        if (isEdit) {
          await updateAdminPost(data.slug, payload)
        } else {
          await createAdminPost(payload)
        }
        sessionStorage.removeItem(DRAFT_KEY)
        navigate('/admin/posts')
      } catch (e: any) {
        setError(e.message || 'Save failed')
      }
      setSaving(false)
    },
    [md, isEdit, navigate, form]
  )

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-mono text-xs text-muted mb-1.5">Title</label>
          <input
            {...register('title')}
            className="w-full px-3 py-2 rounded-md bg-bg border border-border text-text text-sm focus:outline-none focus:border-accent transition-colors duration-150"
          />
          {errors.title && <p className="text-red-400 text-xs mt-1 font-mono">{errors.title.message}</p>}
        </div>
        <div>
          <label className="block font-mono text-xs text-muted mb-1.5">Slug</label>
          <input
            {...register('slug')}
            className="w-full px-3 py-2 rounded-md bg-bg border border-border text-text text-sm font-mono focus:outline-none focus:border-accent transition-colors duration-150"
          />
          {errors.slug && <p className="text-red-400 text-xs mt-1 font-mono">{errors.slug.message}</p>}
        </div>
        <div>
          <label className="block font-mono text-xs text-muted mb-1.5">Date</label>
          <input
            type="date"
            {...register('date')}
            className="w-full px-3 py-2 rounded-md bg-bg border border-border text-text text-sm font-mono focus:outline-none focus:border-accent transition-colors duration-150"
          />
          {errors.date && <p className="text-red-400 text-xs mt-1 font-mono">{errors.date.message}</p>}
        </div>
        <div>
          <label className="block font-mono text-xs text-muted mb-1.5">Tags (comma-separated)</label>
          <input
            {...register('tags')}
            placeholder="react, typescript"
            className="w-full px-3 py-2 rounded-md bg-bg border border-border text-text text-sm font-mono focus:outline-none focus:border-accent transition-colors duration-150"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block font-mono text-xs text-muted mb-1.5">Excerpt</label>
          <input
            {...register('excerpt')}
            className="w-full px-3 py-2 rounded-md bg-bg border border-border text-text text-sm focus:outline-none focus:border-accent transition-colors duration-150"
          />
          {errors.excerpt && <p className="text-red-400 text-xs mt-1 font-mono">{errors.excerpt.message}</p>}
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            {...register('published')}
            id="published"
            className="rounded border-border bg-bg text-accent focus:ring-accent"
          />
          <label htmlFor="published" className="text-sm text-muted">
            Published
          </label>
        </div>
      </div>

      <div>
        <label className="block font-mono text-xs text-muted mb-1.5">Content (Markdown)</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <textarea
            value={md}
            onChange={(e) => setMd(e.target.value)}
            rows={20}
            className="w-full px-3 py-2 rounded-md bg-bg border border-border text-text text-sm font-mono focus:outline-none focus:border-accent transition-colors duration-150 resize-y"
          />
          <div className="rounded-md border border-border bg-bg p-4 overflow-y-auto max-h-[600px]">
            {md ? (
              <MarkdownRenderer content={md} />
            ) : (
              <p className="font-mono text-sm text-subtle italic">Preview will appear here…</p>
            )}
          </div>
        </div>
      </div>

      {error && <p className="text-red-400 text-xs font-mono">{error}</p>}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="bg-accent text-bg font-medium text-sm px-5 py-2.5 rounded-md hover:bg-accent/90 transition-colors duration-150 disabled:opacity-50"
        >
          {saving ? 'Saving…' : isEdit ? 'Update post' : 'Create post'}
        </button>
        <button
          type="button"
          onClick={() => navigate('/admin/posts')}
          className="px-5 py-2.5 rounded-md border border-border text-muted text-sm font-mono hover:text-text transition-colors duration-150"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
