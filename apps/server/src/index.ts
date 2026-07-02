import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { env } from './env'
import { pbProxyRoute } from './pb-proxy'
import { apikeysRoute } from './routes/apikeys'
import { billingRoute, whopWebhookRoute } from './routes/billing'
import { creditsRoute, transactionsRoute } from './routes/credits'
import { publicRoute } from './routes/public'
import { todosRoute } from './routes/todos'
import { userAuth, type AuthVariables } from './middleware/auth'

const app = new Hono<{ Variables: AuthVariables }>()

app.use(logger())
app.use('/api/*', cors({ origin: env.CORS_ORIGIN.split(','), allowHeaders: ['Authorization', 'Content-Type', 'X-Api-Key'] }))
app.use('/pb/*', cors())

app.get('/api/hello', (c) => c.json({ message: 'Hello from Hono! 🔥' }))
app.get('/api/me', userAuth, (c) => {
  const user = c.get('user')
  return c.json({ id: user.id, email: user.email, name: user.name, plan: user.plan })
})

app.route('/pb', pbProxyRoute)
app.route('/api/todos', todosRoute)
app.route('/api/keys', apikeysRoute)
app.route('/api/billing', billingRoute)
app.route('/api/webhooks', whopWebhookRoute)
app.route('/api/credits', creditsRoute)
app.route('/api/transactions', transactionsRoute)
app.route('/api/public', publicRoute)

// ── Production: serve built web assets + SPA fallback ───────
app.use('/assets/*', serveStatic({ root: './public' }))
app.get('*', serveStatic({ root: './public' }))
app.get('*', async (c) => {
  const path = c.req.path
  if (path.startsWith('/api/') || path.startsWith('/pb/')) {
    return c.notFound()
  }
  return serveStatic({ path: './index.html', root: './public' })(c, async () => {
    c.notFound()
  })
})

serve({ fetch: app.fetch, port: env.PORT }, (info) => {
  console.log(`🚀 Server running at http://localhost:${info.port}`)
})
