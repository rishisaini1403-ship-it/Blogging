import type { VercelRequest, VercelResponse } from '@vercel/node'
import crypto from 'crypto'

const SECRET = process.env.SESSION_SECRET || ''
const ADMIN_PW = process.env.ADMIN_PASSWORD || ''

const LOCKOUT_MAX = 5
const LOCKOUT_WINDOW_MS = 15 * 60 * 1000
const DELAY_MS = 1500

const attempts = new Map<string, { count: number; start: number }>()

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}

function makeToken(): string {
  const payload = JSON.stringify({ exp: Date.now() + 4 * 60 * 60 * 1000 })
  const b64 = Buffer.from(payload).toString('base64url')
  const sig = crypto.createHmac('sha256', SECRET).update(b64).digest('hex')
  return `${b64}.${sig}`
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  if (!SECRET || !ADMIN_PW) {
    return res.status(500).json({ error: 'Server not configured' })
  }

  const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || 'unknown'

  const now = Date.now()
  const entry = attempts.get(ip)

  if (entry && now - entry.start < LOCKOUT_WINDOW_MS && entry.count >= LOCKOUT_MAX) {
    await sleep(DELAY_MS)
    return res.status(429).json({ error: 'Too many attempts. Try again later.' })
  }

  const { password } = req.body || {}

  if (!password) {
    await sleep(DELAY_MS)
    return res.status(400).json({ error: 'Password required' })
  }

  const ok = crypto.timingSafeEqual(Buffer.from(password), Buffer.from(ADMIN_PW))

  await sleep(DELAY_MS)

  if (!ok) {
    const prev = attempts.get(ip)
    if (prev && now - prev.start < LOCKOUT_WINDOW_MS) {
      prev.count++
    } else {
      attempts.set(ip, { count: 1, start: now })
    }
    return res.status(401).json({ error: 'Invalid password' })
  }

  attempts.delete(ip)

  const token = makeToken()

  res.setHeader(
    'Set-Cookie',
    `admin_session=${token}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=14400`
  )

  return res.status(200).json({ ok: true })
}
