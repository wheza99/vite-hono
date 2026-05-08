import 'dotenv/config'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import { verifyUserToken, pbList, pbFirst, pbCreate } from './pb'
import { createApiKey, listApiKeys, deleteApiKey, verifyApiKey } from './api-keys'
import { createPayment, listPayments, getPayment, checkAndUpdatePaymentStatus } from './payments'

// ── Env config ──────────────────────────────────────────────
const PORT = Number(process.env.PORT) || 3000
const PB_INTERNAL = process.env.POCKETBASE_URL || 'http://localhost:8090'

const app = new Hono()

// ── CORS ────────────────────────────────────────────────────
app.use('/api/*', cors())
app.use('/pb/*', cors())

// ═══════════════════════════════════════════════════════════
// POCKETBASE PROXY
// ═══════════════════════════════════════════════════════════

app.all('/pb/*', async (c) => {
  const path = c.req.path.replace(/^\/pb/, '')
  const url = `${PB_INTERNAL}${path}${c.req.url.includes('?') ? '?' + c.req.url.split('?')[1] : ''}`

  const method = c.req.method
  const headers = new Headers()
  const fwdHeaders = ['content-type', 'authorization', 'accept']
  for (const h of fwdHeaders) {
    const v = c.req.header(h)
    if (v) headers.set(h, v)
  }

  const body = method !== 'GET' && method !== 'HEAD' ? await c.req.arrayBuffer() : undefined

  const pbRes = await fetch(url, { method, headers, body })

  const resHeaders = new Headers()
  pbRes.headers.forEach((v, k) => {
    if (!['content-encoding', 'content-length', 'transfer-encoding', 'content-security-policy'].includes(k.toLowerCase())) {
      resHeaders.set(k, v)
    }
  })
  resHeaders.set('Cache-Control', 'no-transform')

  return new Response(pbRes.body, {
    status: pbRes.status,
    headers: resHeaders,
  })
})

// ── Public routes ───────────────────────────────────────────
app.get('/api/hello', (c) => {
  return c.json({ message: 'Hello from Hono! 🔥' })
})

// ── User Auth middleware (PocketBase token) ─────────────────
async function userAuth(c: any, next: any) {
  const authHeader = c.req.header('Authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401)
  }

  const token = authHeader.replace('Bearer ', '')
  const user = await verifyUserToken(token)

  if (!user) {
    return c.json({ error: 'Invalid or expired token' }, 401)
  }

  c.set('user', user)
  c.set('token', token)
  await next()
}

// ── API Key middleware ──────────────────────────────────────
async function apiKeyAuth(c: any, next: any) {
  const rawKey = c.req.header('X-Api-Key')

  if (!rawKey) {
    return c.json({ error: 'Missing API key. Send X-Api-Key header.' }, 401)
  }

  const keyInfo = await verifyApiKey(rawKey)
  if (!keyInfo) {
    return c.json({ error: 'Invalid or expired API key' }, 401)
  }

  c.set('authType', 'apikey')
  c.set('apiKeyInfo', keyInfo)
  await next()
}

// ═══════════════════════════════════════════════════════════
// USER AUTH ROUTES
// ═══════════════════════════════════════════════════════════

app.use('/api/me', userAuth)
app.use('/api/todos/*', userAuth)
app.use('/api/keys/*', userAuth)
app.use('/api/payments/*', userAuth)
app.use('/api/transactions', userAuth)
app.use('/api/credits', userAuth)

app.get('/api/me', (c) => {
  const user = c.get('user')
  return c.json({ id: user.id, email: user.email })
})

// ── User Todos ──────────────────────────────────────────────
let todos = [
  { id: 1, text: 'Belajar Vite + Hono', done: true },
  { id: 2, text: 'Bikin project keren', done: false },
]

app.get('/api/todos', (c) => {
  const user = c.get('user')
  console.log(`Todos requested by: ${user.email}`)
  return c.json(todos)
})

app.post('/api/todos', async (c) => {
  const body = await c.req.json<{ text: string }>()
  const newTodo = { id: Date.now(), text: body.text, done: false }
  todos.push(newTodo)
  return c.json(newTodo, 201)
})

app.put('/api/todos/:id', async (c) => {
  const id = Number(c.req.param('id'))
  const body = await c.req.json<{ done: boolean }>()
  todos = todos.map((t) => (t.id === id ? { ...t, done: body.done } : t))
  return c.json({ ok: true })
})

app.delete('/api/todos/:id', (c) => {
  const id = Number(c.req.param('id'))
  todos = todos.filter((t) => t.id !== id)
  return c.json({ ok: true })
})

// ── Manage API Keys (user auth) ─────────────────────────────
app.post('/api/keys', async (c) => {
  const user = c.get('user')
  const body = await c.req.json<{ name: string }>()

  try {
    const key = await createApiKey(user.id, body.name || user.email)
    return c.json(key, 201)
  } catch (err: any) {
    return c.json({ error: err.message }, 500)
  }
})

app.get('/api/keys', async (c) => {
  const user = c.get('user')

  try {
    const keys = await listApiKeys(user.id)
    return c.json(keys)
  } catch (err: any) {
    return c.json({ error: err.message }, 500)
  }
})

app.delete('/api/keys/:id', async (c) => {
  const user = c.get('user')
  const keyId = c.req.param('id')

  try {
    await deleteApiKey(user.id, keyId)
    return c.json({ ok: true })
  } catch (err: any) {
    return c.json({ error: err.message }, 500)
  }
})

// ═══════════════════════════════════════════════════════════
// PAYMENTS ROUTES
// ═══════════════════════════════════════════════════════════

app.post('/api/payments/topup', async (c) => {
  const user = c.get('user')
  const body = await c.req.json<{ amount: number; method?: string }>()

  try {
    const origin = c.req.header('origin') || process.env.APP_URL || 'http://localhost:5173'
    const payment = await createPayment(user.id, user.email, body.amount, body.method, `${origin}/billing`)
    return c.json(payment, 201)
  } catch (err: any) {
    return c.json({ error: err.message }, 400)
  }
})

app.get('/api/payments', async (c) => {
  const user = c.get('user')

  try {
    const payments = await listPayments(user.id)
    return c.json(payments)
  } catch (err: any) {
    return c.json({ error: err.message }, 500)
  }
})

app.get('/api/payments/:id/status', async (c) => {
  const user = c.get('user')
  const paymentId = c.req.param('id')

  try {
    await getPayment(user.id, paymentId)
    const payment = await checkAndUpdatePaymentStatus(paymentId)
    return c.json(payment)
  } catch (err: any) {
    return c.json({ error: err.message }, 400)
  }
})

// ═══════════════════════════════════════════════════════════
// CREDITS & TRANSACTIONS ROUTES
// ═══════════════════════════════════════════════════════════

app.get('/api/credits', async (c) => {
  const user = c.get('user')

  try {
    const data = await pbFirst('credits', `user_id='${user.id}'`)
    if (!data) return c.json({ total: 0 })
    return c.json({ total: data.total })
  } catch {
    return c.json({ total: 0 })
  }
})

app.get('/api/transactions', async (c) => {
  const user = c.get('user')

  try {
    const items = await pbList('transactions', `user_id='${user.id}'`, '-created')
    return c.json(items)
  } catch (err: any) {
    return c.json({ error: err.message }, 500)
  }
})

// ═══════════════════════════════════════════════════════════
// PUBLIC API ROUTES (API Key auth)
// ═══════════════════════════════════════════════════════════

app.use('/api/public/*', apiKeyAuth)

app.get('/api/public/todos', (c) => {
  return c.json({ data: todos })
})

app.get('/api/public/stats', (c) => {
  return c.json({
    total: todos.length,
    done: todos.filter((t) => t.done).length,
    pending: todos.filter((t) => !t.done).length,
  })
})

// ── Production: serve React static files ────────────────────
app.use('/assets/*', serveStatic({ root: './public' }))
app.get('*', serveStatic({ root: './public' }))

// SPA fallback: serve index.html for all non-API/non-asset routes
app.get('*', async (c) => {
  const path = c.req.path
  if (path.startsWith('/api/') || path.startsWith('/pb/')) {
    return c.notFound()
  }
  return serveStatic({ path: './index.html', root: './public' })(c, async () => c.notFound())
})

// ── Start server ────────────────────────────────────────────
serve({ fetch: app.fetch, port: PORT }, (info) => {
  console.log(`🚀 Server running at http://localhost:${info.port}`)
})
