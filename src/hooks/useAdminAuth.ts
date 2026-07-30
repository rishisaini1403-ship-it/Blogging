import { useState, useEffect, useCallback } from 'react'

export function useAdminAuth() {
  const [authed, setAuthed] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/auth-check')
      .then((r) => {
        if (r.ok) setAuthed(true)
        else setAuthed(false)
      })
      .catch(() => setAuthed(false))
      .finally(() => setLoading(false))
  }, [])

  const login = useCallback(async (password: string) => {
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    if (res.ok) {
      setAuthed(true)
      return null
    }
    const data = await res.json().catch(() => ({}))
    return data.error || 'Login failed'
  }, [])

  const logout = useCallback(() => {
    document.cookie = 'admin_session=; Max-Age=0; Path=/'
    setAuthed(false)
  }, [])

  return { authed, loading, login, logout }
}
