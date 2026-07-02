import type { AuthUser } from '@vite-hono/shared'
import { invalidateUserTokenCache, pbCreate, pbUpdate, pbView } from './pocketbase'

export const FREE_MONTHLY_CREDITS = 3
export const PRO_MONTHLY_CREDITS = 100

function oneMonthLater(from: Date): string {
  const d = new Date(from)
  d.setMonth(d.getMonth() + 1)
  return d.toISOString()
}

// Lazy reset: called before balance checks. Returns current balance.
export async function ensureCredits(user: AuthUser): Promise<number> {
  const resetAt = user.credits_reset_at ? new Date(user.credits_reset_at) : null
  const now = new Date()
  if (!resetAt || resetAt <= now) {
    const credits = user.plan === 'pro' ? PRO_MONTHLY_CREDITS : FREE_MONTHLY_CREDITS
    await pbUpdate('users', user.id, {
      credits,
      credits_reset_at: oneMonthLater(now),
      plan: user.plan || 'free',
    })
    await pbCreate('transactions', {
      user_id: user.id,
      type: 'credit',
      amount: credits,
      description: `Monthly ${user.plan || 'free'} credits reset`,
      reference: 'monthly_reset',
    })
    invalidateUserTokenCache(user.id)
    return credits
  }
  return user.credits
}

export async function deductCredit(userId: string, description = 'API usage'): Promise<number> {
  const record = await pbView('users', userId)
  const next = Math.max(0, (record.credits ?? 0) - 1)
  await pbUpdate('users', userId, { credits: next })
  await pbCreate('transactions', {
    user_id: userId,
    type: 'debit',
    amount: 1,
    description,
    reference: '',
  })
  invalidateUserTokenCache(userId)
  return next
}

export async function addCredit(
  userId: string,
  amount: number,
  description: string,
  reference = '',
): Promise<number> {
  const record = await pbView('users', userId)
  const next = (record.credits ?? 0) + amount
  await pbUpdate('users', userId, { credits: next })
  await pbCreate('transactions', {
    user_id: userId,
    type: 'credit',
    amount,
    description,
    reference,
  })
  invalidateUserTokenCache(userId)
  return next
}
