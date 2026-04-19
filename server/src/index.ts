import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import { jwt } from 'hono/jwt'

const app = new Hono()

// ── Env config ──────────────────────────────────────────────
const SUPABASE_URL = process.env.SUPABASE_URL || ''
const SUPABASE_JWT_SECRET = process.env.SUPABASE_JWT_SECRET || ''
const PORT = Number(process.env.PORT) || 3000

// ── CORS ────────────────────────────────────────────────────
app.use('/api/*', cors())

// ── Public routes ───────────────────────────────────────────
app.get('/api/hello', (c) => {
  return c.json({ message: 'Hello from Hono! 🔥' })
})

// ── Auth middleware ──────────────────────────────────────────
// Verify Supabase JWT on protected routes
const authMiddleware = jwt({
  secret: SUPABASE_JWT_SECRET,
})

// ── Protected routes ────────────────────────────────────────
let todos = [
  { id: 1, text: 'Belajar Vite + Hono', done: true },
  { id: 2, text: 'Bikin project keren', done: false },
]

app.use('/api/todos/*', authMiddleware)

app.get('/api/todos', (c) => {
  const user = c.get('jwtPayload')
  console.log(`Todos requested by: ${user.sub}`)
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

// ── Auth status endpoint ────────────────────────────────────
app.get('/api/me', authMiddleware, (c) => {
  const user = c.get('jwtPayload')
  return c.json({
    id: user.sub,
    email: user.email,
    role: user.role,
  })
})

// ── Production: serve React static files ────────────────────
app.use('/assets/*', serveStatic({ root: './public' }))
app.get('*', serveStatic({ root: './public' }))

// ── Start server ────────────────────────────────────────────
serve({ fetch: app.fetch, port: PORT }, (info) => {
  console.log(`🚀 Server running at http://localhost:${info.port}`)
})
