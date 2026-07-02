import { Hono } from 'hono'
import { env } from './env'

// Proxy all /pb/* to PocketBase — the client never learns the PB URL
export const pbProxyRoute = new Hono()

pbProxyRoute.all('*', async (c) => {
  const path = c.req.path.replace(/^\/pb/, '')
  const url = `${env.POCKETBASE_URL}${path}${c.req.url.includes('?') ? '?' + c.req.url.split('?')[1] : ''}`

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
