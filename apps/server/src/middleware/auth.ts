import { createMiddleware } from 'hono/factory'
import type { AuthUser } from '@vite-hono/shared'
import { verifyUserToken } from '../lib/pocketbase'
import { verifyApiKey, type ApiKeyInfo } from '../lib/api-keys'

export type AuthVariables = {
  user: AuthUser
  token: string
  apiKeyInfo: ApiKeyInfo | null
}

// Verify `Authorization: Bearer {pb token}` — result cached 5 min
export const userAuth = createMiddleware<{ Variables: AuthVariables }>(async (c, next) => {
  const header = c.req.header('Authorization') ?? ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : ''
  if (!token) {
    return c.json({ error: { code: 'unauthorized', message: 'Missing bearer token' } }, 401)
  }
  const user = await verifyUserToken(token)
  if (!user) {
    return c.json({ error: { code: 'unauthorized', message: 'Invalid or expired token' } }, 401)
  }
  c.set('user', user)
  c.set('token', token)
  await next()
})

// Verify `X-Api-Key: sk-xxx`
export const apiKeyAuth = createMiddleware<{ Variables: AuthVariables }>(async (c, next) => {
  const rawKey = c.req.header('X-Api-Key')
  if (!rawKey) {
    return c.json({ error: { code: 'unauthorized', message: 'Missing API key. Send X-Api-Key header.' } }, 401)
  }
  const keyInfo = await verifyApiKey(rawKey)
  if (!keyInfo) {
    return c.json({ error: { code: 'unauthorized', message: 'Invalid or expired API key' } }, 401)
  }
  c.set('apiKeyInfo', keyInfo)
  await next()
})

// Use after userAuth
export const requirePro = createMiddleware<{ Variables: AuthVariables }>(async (c, next) => {
  const user = c.get('user')
  if (user.plan !== 'pro') {
    return c.json(
      { error: { code: 'pro_required', message: 'This feature requires a Pro subscription.' } },
      403,
    )
  }
  await next()
})
