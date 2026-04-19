import { Hono } from 'hono'
import crypto from 'crypto'

const api = new Hono().basePath('/api')

// ── In-memory data ──────────────────────────────────────────
let todos = [
  { id: 1, text: 'Belajar Vite + Hono', done: true },
  { id: 2, text: 'Bikin project keren', done: false },
]

interface ApiKey {
  id: string
  userId: string
  name: string
  keyHash: string
  keyPrefix: string
  keySuffix: string
  createdAt: string
  lastUsedAt: string | null
  expiresAt: string | null
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
  const rawKey = `ak_${randomHex(16)}`
  const keyHash = hashKey(rawKey)
  const keyPrefix = rawKey.slice(0, 8)
  const keySuffix = rawKey.slice(-4)
  const id = crypto.randomUUID()

  apiKeys.push({
    id,
    userId: 'dev-user',
    name: body.name || 'Default',
    keyHash,
    keyPrefix,
    keySuffix,
    createdAt: new Date().toISOString(),
    lastUsedAt: null,
    expiresAt: null,
  })

  return c.json({
    id,
    name: body.name || 'Default',
    keyPrefix,
    keySuffix,
    createdAt: new Date().toISOString(),
    rawKey,
  }, 201)
})

api.get('/keys', (c) => {
  return c.json(apiKeys.map(({ keyHash: _, ...key }) => ({
    id: key.id,
    name: key.name,
    keyPrefix: key.keyPrefix,
    keySuffix: key.keySuffix,
    createdAt: key.createdAt,
    lastUsedAt: key.lastUsedAt,
    expiresAt: key.expiresAt,
  })))
})

api.delete('/keys/:id', (c) => {
  const id = c.req.param('id')
  apiKeys = apiKeys.filter((k) => k.id !== id)
  return c.json({ ok: true })
})

// ── Public API (API Key auth) ───────────────────────────────
api.use('/public/*', async (c, next) => {
  const rawKey = c.req.header('X-Api-Key')
  if (!rawKey) {
    return c.json({ error: 'Missing API key' }, 401)
  }
  const keyHash = hashKey(rawKey)
  const key = apiKeys.find((k) => k.keyHash === keyHash)
  if (!key) {
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
