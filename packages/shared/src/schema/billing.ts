import { z } from 'zod'

export const CheckoutRequestSchema = z.object({}).passthrough()
export type CheckoutRequest = z.infer<typeof CheckoutRequestSchema>

export const CheckoutResponseSchema = z.object({
  sessionId: z.string(),
  planId: z.string().nullable().optional(),
})
export type CheckoutResponse = z.infer<typeof CheckoutResponseSchema>
