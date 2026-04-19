import { Hono } from 'hono'
import crypto from 'crypto'

const api = new Hono().basePath('/api')

// ── In-memory data ──────────────────────────────────────────
let todos = [
  { id: 1, text: 'Belajar Vite + Hono', done: true },
  { id: 2, text: 'Bikin project keren', done: false },
]

interface ApiKey {
  accessKey: string
  secretKeyHash: string
  name: string
  createdAt: string
}

let apiKeys: ApiKey[] = []

function randomHex(bytes: number) {
  return crypto.randomBytes(bytes).toString('hex')
}

function hashKey(key: string) {
  return crypto.createHash('sha256').update(key).digest('hex')
}

// ── Public routes ───────────────────────────────────────────
api.get('/hello', (c) => {
  return c.json({ message: 'Hello from Hono! 🔥' })
})

// ── User Todos ──────────────────────────────────────────────
api.get('/todos', (c) => {
  return c.json(todos)
})

api.post('/todos', async (c) => {
  const body = await c.req.json<{ text: string }>()
  const newTodo = { id: Date.now(), text: body.text, done: false }
  todos.push(newTodo)
  return c.json(newTodo, 201)
})

api.put('/todos/:id', async (c) => {
  const id = Number(c.req.param('id'))
  const body = await c.req.json<{ done: boolean }>()
  todos = todos.map((t) => (t.id === id ? { ...t, done: body.done } : t))
  return c.json({ ok: true })
})

api.delete('/todos/:id', (c) => {
  const id = Number(c.req.param('id'))
  todos = todos.filter((t) => t.id !== id)
  return c.json({ ok: true })
})

// ── API Key Management ──────────────────────────────────────
api.post('/keys', async (c) => {
  const body = await c.req.json<{ name: string }>()
  const accessKey = randomHex(5)            // 10 chars
  const secretKey = `sk_${randomHex(10)}`   // sk_ + 20 chars
  apiKeys.push({
    accessKey,
    secretKeyHash: hashKey(secretKey),
    name: body.name || 'Default',
    createdAt: new Date().toISOString(),
  })
  return c.json({ accessKey, secretKey }, 201)
})

api.get('/keys', (c) => {
  return c.json(apiKeys.map(({ secretKeyHash: _, ...key }) => key))
})

api.delete('/keys/:accessKey', (c) => {
  const accessKey = c.req.param('accessKey')
  apiKeys = apiKeys.filter((k) => k.accessKey !== accessKey)
  return c.json({ ok: true })
})

// ── Public API (API Key auth) ───────────────────────────────
api.use('/public/*', async (c, next) => {
  const accessKey = c.req.header('X-Access-Key')
  const secretKey = c.req.header('X-Secret-Key')
  if (!accessKey || !secretKey) {
    return c.json({ error: 'Missing API key' }, 401)
  }
  const key = apiKeys.find((k) => k.accessKey === accessKey)
  if (!key || key.secretKeyHash !== hashKey(secretKey)) {
    return c.json({ error: 'Invalid API key' }, 401)
  }
  await next()
})

api.get('/public/todos', (c) => {
  return c.json({ data: todos })
})

api.get('/public/stats', (c) => {
  return c.json({
    total: todos.length,
    done: todos.filter((t) => t.done).length,
    pending: todos.filter((t) => !t.done).length,
  })
})

export default api
