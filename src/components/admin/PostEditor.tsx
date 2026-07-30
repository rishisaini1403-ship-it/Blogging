import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
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

// Use localStorage key unique to this editor session
const DRAFT_KEY = 'admin-editor-draft'

export default function PostEditor({ existing }: { existing?: AdminPost | null }) {
  const navigate = useNavigate()
  const isEdit = !!existing
  const [md, setMd] = useState(existing?.content || '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

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
          title: '',
          slug: '',
          date: new Date().toISOString().slice(0, 10),
          tags: '',
          excerpt: '',
          published: true,
        },
  })

  const { register, handleSubmit, setValue, watch, formState: { errors } } = form
  const title = watch('title')
  const slug = watch('slug')

  // Auto-slug when creating
  useEffect(() => {
    if (!isEdit && title && !slug) {
      setValue('slug', slugify(title))
    }
  }, [title, slug, isEdit, setValue])

  // Auto-save draft to localStorage every 30s
  useEffect(() => {
    const interval = setInterval(() => {
      const data = { ...form.getValues(), md }
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify(data))
    }, 30000)
    return () => clearInterval(interval)
  }, [form, md])

  const submit = useCallback(async (data: Form) => {
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
  }, [md, isEdit, navigate])

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-6">
      {/* Meta fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Title</label>
          <input {...register('title')} className="w-full px-3 py-2 rounded-lg border border-surface-border bg-surface text-white text-sm focus:outline-none focus:border-accent" />
          {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>}
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Slug</label>
          <input {...register('slug')} className="w-full px-3 py-2 rounded-lg border border-surface-border bg-surface text-white text-sm focus:outline-none focus:border-accent" />
          {errors.slug && <p className="text-red-400 text-xs mt-1">{errors.slug.message}</p>}
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Date</label>
          <input type="date" {...register('date')} className="w-full px-3 py-2 rounded-lg border border-surface-border bg-surface text-white text-sm focus:outline-none focus:border-accent" />
          {errors.date && <p className="text-red-400 text-xs mt-1">{errors.date.message}</p>}
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Tags (comma-separated)</label>
          <input {...register('tags')} placeholder="react, typescript" className="w-full px-3 py-2 rounded-lg border border-surface-border bg-surface text-white text-sm focus:outline-none focus:border-accent" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs text-gray-500 mb-1">Excerpt</label>
          <input {...register('excerpt')} className="w-full px-3 py-2 rounded-lg border border-surface-border bg-surface text-white text-sm focus:outline-none focus:border-accent" />
          {errors.excerpt && <p className="text-red-400 text-xs mt-1">{errors.excerpt.message}</p>}
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" {...register('published')} id="published" className="rounded border-surface-border bg-surface text-accent focus:ring-accent" />
          <label htmlFor="published" className="text-sm text-gray-400">Published</label>
        </div>
      </div>

      {/* Editor + Preview split */}
      <div>
        <label className="block text-xs text-gray-500 mb-1">Content (Markdown)</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <textarea
            value={md}
            onChange={(e) => setMd(e.target.value)}
            rows={20}
            className="w-full px-3 py-2 rounded-lg border border-surface-border bg-surface text-white text-sm font-mono focus:outline-none focus:border-accent resize-y"
          />
          <div className="rounded-lg border border-surface-border bg-[#111] p-4 overflow-y-auto max-h-[600px]">
            {md ? (
              <MarkdownRenderer content={md} />
            ) : (
              <p className="text-gray-600 text-sm italic">Preview will appear here...</p>
            )}
          </div>
        </div>
      </div>

      {error && <p className="text-red-400 text-xs">{error}</p>}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2.5 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent/90 transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving...' : isEdit ? 'Update Post' : 'Create Post'}
        </button>
        <button
          type="button"
          onClick={() => navigate('/admin/posts')}
          className="px-5 py-2.5 rounded-lg border border-surface-border text-gray-400 text-sm hover:text-white transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
