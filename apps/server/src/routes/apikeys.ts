import { Hono } from 'hono'
import { CreateApiKeySchema } from '@vite-hono/shared'
import { createApiKey, deleteApiKey, listApiKeys } from '../lib/api-keys'
import { userAuth, type AuthVariables } from '../middleware/auth'

export const apikeysRoute = new Hono<{ Variables: AuthVariables }>()

apikeysRoute.use('*', userAuth)

apikeysRoute.post('/', async (c) => {
  const user = c.get('user')
  const parsed = CreateApiKeySchema.safeParse(await c.req.json().catch(() => ({})))
  if (!parsed.success) {
    return c.json({ error: { code: 'invalid_body', message: 'Invalid body' } }, 400)
  }
  const key = await createApiKey(user.id, parsed.data.name || user.email)
  return c.json(key, 201)
})

apikeysRoute.get('/', async (c) => {
  const user = c.get('user')
  return c.json(await listApiKeys(user.id))
})

apikeysRoute.delete('/:id', async (c) => {
  const user = c.get('user')
  try {
    await deleteApiKey(user.id, c.req.param('id'))
    return c.json({ ok: true })
  } catch {
    return c.json({ error: { code: 'not_found', message: 'API key not found' } }, 404)
  }
})
