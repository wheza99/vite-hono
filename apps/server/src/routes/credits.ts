import { Hono } from 'hono'
import type { Transaction } from '@vite-hono/shared'
import { ensureCredits } from '../lib/credits'
import { pbList } from '../lib/pocketbase'
import { userAuth, type AuthVariables } from '../middleware/auth'

export const creditsRoute = new Hono<{ Variables: AuthVariables }>()

creditsRoute.use('*', userAuth)

creditsRoute.get('/', async (c) => {
  const user = c.get('user')
  const credits = await ensureCredits(user)
  return c.json({
    plan: user.plan || 'free',
    credits,
    resetsAt: user.credits_reset_at || null,
  })
})

export const transactionsRoute = new Hono<{ Variables: AuthVariables }>()

transactionsRoute.use('*', userAuth)

transactionsRoute.get('/', async (c) => {
  const user = c.get('user')
  const items = await pbList('transactions', `user_id='${user.id}'`, '-created')
  const transactions: Transaction[] = items.map((r: Record<string, unknown>) => ({
    id: r.id as string,
    type: r.type as Transaction['type'],
    amount: (r.amount as number) ?? 0,
    description: (r.description as string) ?? '',
    reference: (r.reference as string) ?? '',
    created: (r.created as string) ?? '',
  }))
  return c.json(transactions)
})
