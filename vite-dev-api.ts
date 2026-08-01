import type { Connect, Plugin } from 'vite'
import type { IncomingMessage, ServerResponse } from 'http'
import { readFile, stat } from 'fs/promises'
import { join } from 'path'

interface VercelRequest extends IncomingMessage {
  body?: unknown
  cookies?: Record<string, string>
}

function parseCookies(header: string | undefined): Record<string, string> {
  const out: Record<string, string> = {}
  if (!header) return out
  for (const part of header.split(';')) {
    const eq = part.indexOf('=')
    if (eq === -1) continue
    const k = part.slice(0, eq).trim()
    const v = part.slice(eq + 1).trim()
    if (k) out[k] = decodeURIComponent(v)
  }
  return out
}

async function readJsonBody(req: IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    req.on('data', (c: Buffer) => chunks.push(c))
    req.on('end', () => {
      const raw = Buffer.concat(chunks).toString('utf-8')
      if (!raw) return resolve(undefined)
      try {
        resolve(JSON.parse(raw))
      } catch {
        resolve({})
      }
    })
    req.on('error', reject)
  })
}

function sendJson(res: ServerResponse, status: number, body: unknown) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(body))
}

function makeVercelRes(res: ServerResponse) {
  const wrapped = res as any
  wrapped.status = (code: number) => {
    res.statusCode = code
    return wrapped
  }
  wrapped.json = (body: unknown) => {
    sendJson(res, res.statusCode || 200, body)
    return wrapped
  }
  // Dev-only: rewrite Set-Cookie to drop the `Secure` flag so the browser
  // sends the cookie back over plain http://localhost. Production keeps the
  // original Secure flag.
  const originalSetHeader = res.setHeader.bind(res)
  res.setHeader = (name: string, value: any) => {
    if (typeof name === 'string' && name.toLowerCase() === 'set-cookie') {
      const cookies = Array.isArray(value) ? value : [value]
      const relaxed = cookies.map((c) =>
        String(c)
          .replace(/;\s*Secure\b/gi, '')
          .replace(/;\s*SameSite=Lax\b/gi, '; SameSite=Lax')
      )
      return originalSetHeader('set-cookie', relaxed)
    }
    return originalSetHeader(name, value)
  }
  return wrapped
}

async function readBodyAsBase64(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    req.on('data', (c: Buffer) => chunks.push(c))
    req.on('end', () => resolve(Buffer.concat(chunks).toString('base64')))
    req.on('error', reject)
  })
}

function importHandler(filePath: string) {
  // Bust module cache between requests so changes to api/*.ts are picked up
  // without a server restart.
  const cacheBuster = `?t=${Date.now()}`
  const fileUrl = `file://${filePath.replace(/\\/g, '/')}${cacheBuster}`
  return import(/* @vite-ignore */ fileUrl)
}

export function devApiPlugin(): Plugin {
  const apiDir = join(process.cwd(), 'api')

  // Load .env.development into process.env so serverless handlers can read
  // ADMIN_PASSWORD / SESSION_SECRET during local dev. Vite exposes these to the
  // client bundle via import.meta.env but the Node process running middleware
  // does not pick them up automatically.
  function loadDevEnv() {
    const path = join(process.cwd(), '.env.development')
    return readFile(path, 'utf-8')
      .then((raw) => {
        for (const line of raw.split(/\r?\n/)) {
          const trimmed = line.trim()
          if (!trimmed || trimmed.startsWith('#')) continue
          const eq = trimmed.indexOf('=')
          if (eq === -1) continue
          const k = trimmed.slice(0, eq).trim()
          const v = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, '')
          if (k && !(k in process.env)) process.env[k] = v
        }
      })
      .catch(() => {})
  }

  return {
    name: 'dev-api',
    async configureServer(server: { middlewares: Connect.Server }) {
      await loadDevEnv()
      server.middlewares.use(async (req, res, next) => {
        if (!req.url || !req.url.startsWith('/api/')) return next()
        if (req.method === 'GET' && (req.url === '/api' || req.url === '/api/')) return next()

        const route = req.url.split('?')[0]
        const rel = route.replace(/^\/+/, '').replace(/^api\//, '')
        const fileName = rel + '.ts'
        const filePath = join(apiDir, fileName)
        try {
          await stat(filePath)
        } catch {
          return sendJson(res, 404, { error: 'Not found' })
        }

        const vReq = req as VercelRequest
        vReq.cookies = parseCookies(req.headers.cookie)
        if (req.method === 'POST' || req.method === 'PUT' || req.method === 'DELETE') {
          const ct = req.headers['content-type'] || ''
          if (ct.includes('application/json')) {
            vReq.body = await readJsonBody(req)
          } else {
            vReq.body = await readBodyAsBase64(req)
          }
        }
        const vRes = makeVercelRes(res)
        try {
          const mod = await importHandler(filePath)
          const handler = mod.default || mod.handler
          if (!handler) throw new Error('No default export')
          await handler(vReq, vRes)
        } catch (e: any) {
          if (!res.headersSent) {
            sendJson(res, 500, { error: e?.message || 'Server error' })
          }
        }
      })
    },
  }
}
