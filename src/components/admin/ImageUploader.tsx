import { useState, useRef } from 'react'

export default function ImageUploader() {
  const [uploading, setUploading] = useState(false)
  const [url, setUrl] = useState('')
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setError('')
    setUrl('')
    setUploading(true)

    try {
      const reader = new FileReader()
      reader.onload = async () => {
        const base64 = (reader.result as string).split(',')[1]
        const res = await fetch('/api/github-proxy', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'upload-image',
            filename: file.name,
            encoding: base64,
          }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Upload failed')
        setUrl(data.url)
      }
      reader.readAsDataURL(file)
    } catch (e: any) {
      setError(e.message || 'Upload failed')
    }
    setUploading(false)
    if (inputRef.current) inputRef.current.value = ''
  }

  const copyUrl = () => {
    if (url) navigator.clipboard.writeText(url)
  }

  return (
    <div className="p-4 rounded-lg border border-surface-border bg-surface">
      <h3 className="text-sm font-medium text-white mb-3">Image Upload</h3>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleUpload}
        disabled={uploading}
        className="block w-full text-sm text-gray-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:bg-accent/10 file:text-accent file:text-xs file:font-medium hover:file:bg-accent/20 transition-colors"
      />

      {uploading && <p className="text-xs text-gray-500 mt-2">Uploading...</p>}
      {error && <p className="text-xs text-red-400 mt-2">{error}</p>}
      {url && (
        <div className="mt-2 flex items-center gap-2">
          <code className="text-xs text-accent truncate">{url}</code>
          <button
            type="button"
            onClick={copyUrl}
            className="text-xs text-gray-500 hover:text-white shrink-0 transition-colors"
          >
            Copy
          </button>
        </div>
      )}
    </div>
  )
}
