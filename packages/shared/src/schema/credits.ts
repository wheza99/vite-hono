import { z } from 'zod'
import { PlanSchema } from './auth'

export const TransactionSchema = z.object({
  id: z.string(),
  type: z.enum(['credit', 'debit']),
  amount: z.number(),
  description: z.string().default(''),
  reference: z.string().default(''),
  created: z.string(),
})
export type Transaction = z.infer<typeof TransactionSchema>

export const CreditsResponseSchema = z.object({
  plan: PlanSchema,
  credits: z.number(),
  resetsAt: z.string().nullable(),
})
export type CreditsResponse = z.infer<typeof CreditsResponseSchema>
