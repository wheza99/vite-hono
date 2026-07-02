import { Hono } from 'hono'
import { pbList } from '../lib/pocketbase'
import { apiKeyAuth, type AuthVariables } from '../middleware/auth'

// Public API routes — authenticated with X-Api-Key, scoped to the key owner
export const publicRoute = new Hono<{ Variables: AuthVariables }>()

publicRoute.use('*', apiKeyAuth)

publicRoute.get('/todos', async (c) => {
  const keyInfo = c.get('apiKeyInfo')!
  const items = await pbList('todos', `user_id='${keyInfo.userId}'`, '-created')
  return c.json({ data: items })
})

publicRoute.get('/stats', async (c) => {
  const keyInfo = c.get('apiKeyInfo')!
  const items = await pbList('todos', `user_id='${keyInfo.userId}'`)
  const done = items.filter((t: { done: boolean }) => t.done).length
  return c.json({
    total: items.length,
    done,
    pending: items.length - done,
  })
})
