import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import { createClient } from '@supabase/supabase-js'
import { createApiKey, listApiKeys, deleteApiKey, verifyApiKey } from './api-keys'

// ── Env config ──────────────────────────────────────────────
const SUPABASE_URL = process.env.SUPABASE_URL || ''
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || ''
const PORT = Number(process.env.PORT) || 3000

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

const app = new Hono()

// ── CORS ────────────────────────────────────────────────────
app.use('/api/*', cors())

// ── Public routes ───────────────────────────────────────────
app.get('/api/hello', (c) => {
  return c.json({ message: 'Hello from Hono! 🔥' })
})

// ── User Auth middleware (Supabase JWT) ─────────────────────
async function userAuth(c: any, next: any) {
  const authHeader = c.req.header('Authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401)
  }

  const token = authHeader.replace('Bearer ', '')
  const { data: { user }, error } = await supabase.auth.getUser(token)

  if (error || !user) {
    return c.json({ error: 'Invalid token' }, 401)
  }

  c.set('user', user)
  await next()
}

// ── API Key middleware (Access Key + Secret Key) ────────────
async function apiKeyAuth(c: any, next: any) {
  const accessKey = c.req.header('X-Access-Key')
  const secretKey = c.req.header('X-Secret-Key')

  if (!accessKey || !secretKey) {
    return c.json({ error: 'Missing API key. Send X-Access-Key and X-Secret-Key headers.' }, 401)
  }

  if (!verifyApiKey(accessKey, secretKey)) {
    return c.json({ error: 'Invalid API key' }, 401)
  }

  c.set('authType', 'apikey')
  await next()
}

// ═══════════════════════════════════════════════════════════
// USER AUTH ROUTES (JWT dari Supabase)
// ═══════════════════════════════════════════════════════════

app.use('/api/me', userAuth)
app.use('/api/todos/*', userAuth)
app.use('/api/keys/*', userAuth)

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
  const key = createApiKey(body.name || user.email)
  return c.json(key, 201)
})

app.get('/api/keys', (c) => {
  return c.json(listApiKeys())
})

app.delete('/api/keys/:accessKey', (c) => {
  deleteApiKey(c.req.param('accessKey'))
  return c.json({ ok: true })
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

// ── Start server ────────────────────────────────────────────
serve({ fetch: app.fetch, port: PORT }, (info) => {
  console.log(`🚀 Server running at http://localhost:${info.port}`)
})
