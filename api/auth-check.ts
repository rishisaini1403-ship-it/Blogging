import type { VercelRequest, VercelResponse } from '@vercel/node'
import crypto from 'crypto'

const SECRET = process.env.SESSION_SECRET || ''

function verifyToken(token: string): boolean {
  const parts = token.split('.')
  if (parts.length !== 2) return false
  const [b64, sig] = parts
  const expected = crypto.createHmac('sha256', SECRET).update(b64).digest('hex')
  if (sig !== expected) return false
  try {
    const { exp } = JSON.parse(Buffer.from(b64, 'base64url').toString())
    return Date.now() < exp
  } catch {
    return false
  }
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  if (!SECRET) {
    return res.status(500).json({ error: 'Server not configured' })
  }

  const cookie = req.cookies?.admin_session
  if (!cookie || !verifyToken(cookie)) {
    return res.status(401).json({ authenticated: false })
  }

  return res.status(200).json({ authenticated: true })
}
