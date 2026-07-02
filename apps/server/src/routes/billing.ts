import { Hono } from 'hono'
import Whop from '@whop/sdk'
import { env } from '../env'
import { PRO_MONTHLY_CREDITS } from '../lib/credits'
import { invalidateUserTokenCache, pbFirst, pbUpdate } from '../lib/pocketbase'
import { userAuth, type AuthVariables } from '../middleware/auth'

function whopClient(): Whop | null {
  if (!env.WHOP_API_KEY) return null
  return new Whop({ apiKey: env.WHOP_API_KEY })
}

export const billingRoute = new Hono<{ Variables: AuthVariables }>()

// Create a checkout configuration → session id for WhopCheckoutEmbed
billingRoute.post('/checkout', userAuth, async (c) => {
  const whop = whopClient()
  if (!whop || !env.WHOP_COMPANY_ID) {
    return c.json(
      { error: { code: 'billing_unavailable', message: 'Billing is not configured' } },
      503,
    )
  }
  const user = c.get('user')
  const config = await whop.checkoutConfigurations.create({
    mode: 'payment',
    plan: {
      company_id: env.WHOP_COMPANY_ID,
      currency: 'usd',
      initial_price: 10.0,
      renewal_price: 10.0,
      plan_type: 'renewal',
      billing_period: 30,
      title: 'Pro Plan',
      ...(env.WHOP_ACCESS_PASS_ID ? { product_id: env.WHOP_ACCESS_PASS_ID } : {}),
    },
    metadata: { user_id: user.id },
  })

  return c.json({ sessionId: config.id, planId: config.plan?.id ?? null })
})

async function setUserPlan(userId: string, plan: 'free' | 'pro', membershipId?: string) {
  const resetAt = new Date()
  resetAt.setMonth(resetAt.getMonth() + 1)
  await pbUpdate('users', userId, {
    plan,
    credits: plan === 'pro' ? PRO_MONTHLY_CREDITS : 0,
    credits_reset_at: plan === 'pro' ? resetAt.toISOString() : new Date(0).toISOString(),
    ...(membershipId !== undefined ? { whop_membership_id: membershipId } : {}),
  })
  invalidateUserTokenCache(userId)
}

async function findUserByMembership(membershipId: string): Promise<string | null> {
  const user = await pbFirst('users', `whop_membership_id='${membershipId}'`).catch(() => null)
  return user?.id ?? null
}

// Whop webhook — signature verified via SDK unwrap
export const whopWebhookRoute = new Hono()

whopWebhookRoute.post('/whop', async (c) => {
  const whop = whopClient()
  if (!whop) return c.text('billing disabled', 503)

  const bodyText = await c.req.text()
  const headers = Object.fromEntries(c.req.raw.headers)

  let event: { type?: string; data?: Record<string, unknown> }
  try {
    event = whop.webhooks.unwrap(bodyText, { headers }) as unknown as typeof event
  } catch (err) {
    console.error('Whop webhook signature invalid:', err)
    return c.text('invalid signature', 401)
  }

  const data = event.data ?? {}
  const metadata = (data.metadata ?? {}) as Record<string, unknown>
  const member = (data.member ?? {}) as Record<string, unknown>
  const membership = (data.membership ?? {}) as Record<string, unknown>
  const membershipId =
    (membership.id as string) ||
    (data.membership_id as string) ||
    (data.id as string) ||
    (member.id as string) ||
    ''

  switch (event.type) {
    case 'payment.succeeded':
    case 'membership.activated': {
      // First payment OR renewal → pro plan + credits reset
      const userId =
        (metadata.user_id as string) || (membershipId && (await findUserByMembership(membershipId)))
      if (userId) {
        await setUserPlan(userId, 'pro', membershipId || undefined)
        console.log(`Whop: ${event.type} → user ${userId} upgraded to pro (+${PRO_MONTHLY_CREDITS} credits)`)
      } else {
        console.warn(`Whop: ${event.type} without a known user_id/membership`)
      }
      break
    }
    case 'membership.deactivated':
    case 'payment.failed': {
      const userId =
        (metadata.user_id as string) || (membershipId && (await findUserByMembership(membershipId)))
      if (userId) {
        await setUserPlan(userId, 'free')
        console.log(`Whop: ${event.type} → user ${userId} downgraded to free`)
      }
      break
    }
    default:
      break
  }

  return c.text('OK')
})
