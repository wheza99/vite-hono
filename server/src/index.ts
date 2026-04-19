import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import { createClient } from '@supabase/supabase-js'

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

// ── Auth middleware ──────────────────────────────────────────
async function authMiddleware(c: any, next: any) {
  const authHeader = c.req.header('Authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401)
  }

  const token = authHeader.replace('Bearer ', '')
  const { data: { user }, error } = await supabase.auth.getUser(token)

  if (error || !user) {
    return c.json({ error: 'Invalid token' }, 401)
  }

  // Simpan user di context buat dipake route handlers
  c.set('user', user)
  await next()
}

// ── Protected routes ────────────────────────────────────────
let todos = [
  { id: 1, text: 'Belajar Vite + Hono', done: true },
  { id: 2, text: 'Bikin project keren', done: false },
]

app.use('/api/todos/*', authMiddleware)
app.use('/api/me', authMiddleware)

app.get('/api/me', (c) => {
  const user = c.get('user')
  return c.json({
    id: user.id,
    email: user.email,
  })
})

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

// ── Production: serve React static files ────────────────────
app.use('/assets/*', serveStatic({ root: './public' }))
app.get('*', serveStatic({ root: './public' }))

// ── Start server ────────────────────────────────────────────
serve({ fetch: app.fetch, port: PORT }, (info) => {
  console.log(`🚀 Server running at http://localhost:${info.port}`)
})
