/**
 * Auth routes — email/password login & register go through the backend so the
 * Cloudflare Turnstile check is actually enforced (a client can't bypass the
 * frontend and hit PocketBase directly). Google OAuth2 stays in the browser
 * via the PocketBase SDK (see apps/web/src/lib/pocketbase.ts) and skips
 * Turnstile — Google has its own bot protection and Turnstile can't run inside
 * a cross-origin OAuth popup. Credits are granted lazily (lib/credits.ts), so
 * there's no separate post-signup provisioning endpoint.
 * Pattern follows the clawmpany-auth skill.
 */
import { Hono } from 'hono'
import PocketBase from 'pocketbase'
import { env } from '../env'

const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

// Verify a Turnstile token server-side. When no secret is configured, skip the
// check (rather than hard-fail) so the template still works in a dev env that
// hasn't set up Turnstile yet.
async function verifyTurnstileToken(token: string | undefined): Promise<boolean> {
  const secret = env.TURNSTILE_SECRET_KEY
  if (!secret) {
    console.warn('[auth] TURNSTILE_SECRET_KEY not set — skipping bot check')
    return true
  }
  if (!token || typeof token !== 'string') return false
  try {
    const res = await fetch(TURNSTILE_VERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret, response: token }),
    })
    const data = (await res.json()) as { success?: boolean; 'error-codes'?: string[] }
    if (!data.success) console.warn('[auth] Turnstile failed:', data['error-codes']?.join(', '))
    return !!data.success
  } catch (err) {
    console.error('[auth] Turnstile verify error:', err)
    return false
  }
}

/** Map a PocketBase create/validation error to a readable message. */
function extractPbError(data: unknown): string {
  const e = data as { data?: Record<string, { message?: string }>; message?: string }
  if (e?.data) {
    const first = Object.values(e.data).find((v) => v?.message)
    if (first?.message) return first.message
  }
  return e?.message || 'Could not create account. Please try again.'
}

export const authRoute = new Hono()

// POST /api/auth/login — Turnstile check, then PocketBase authWithPassword.
authRoute.post('/login', async (c) => {
  const { email, password, turnstileToken } = (await c.req.json().catch(() => ({}))) as {
    email?: string
    password?: string
    turnstileToken?: string
  }
  if (!email || !password) return c.json({ error: 'Email and password are required.' }, 400)
  if (!(await verifyTurnstileToken(turnstileToken))) {
    return c.json({ error: 'Bot check failed. Please try again.' }, 403)
  }
  try {
    const client = new PocketBase(env.POCKETBASE_URL) // fresh client — never touch an admin singleton
    const result = await client.collection('users').authWithPassword(email, password)
    return c.json({
      token: result.token,
      record: JSON.parse(JSON.stringify(result.record)), // strip SDK class → plain object
    })
  } catch {
    return c.json({ error: 'Wrong email or password.' }, 401)
  }
})

// POST /api/auth/register — Turnstile check, create the user, then authenticate.
authRoute.post('/register', async (c) => {
  const { name, email, password, turnstileToken } = (await c.req.json().catch(() => ({}))) as {
    name?: string
    email?: string
    password?: string
    turnstileToken?: string
  }
  if (!email || !password) return c.json({ error: 'Email and password are required.' }, 400)
  if (!(await verifyTurnstileToken(turnstileToken))) {
    return c.json({ error: 'Bot check failed. Please try again.' }, 403)
  }
  try {
    const client = new PocketBase(env.POCKETBASE_URL)
    await client.collection('users').create({
      name: name || email.split('@')[0],
      email,
      password,
      passwordConfirm: password,
      emailVisibility: false,
    })
    const result = await client.collection('users').authWithPassword(email, password)
    return c.json({
      token: result.token,
      record: JSON.parse(JSON.stringify(result.record)),
    })
  } catch (err) {
    const body = (err as { response?: unknown })?.response ?? err
    return c.json({ error: extractPbError(body) }, 400)
  }
})
