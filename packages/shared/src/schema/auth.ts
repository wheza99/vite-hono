import { z } from 'zod'

export const PlanSchema = z.enum(['free', 'pro'])
export type Plan = z.infer<typeof PlanSchema>

export const AuthUserSchema = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string().default(''),
  avatar: z.string().default(''),
  plan: PlanSchema.default('free'),
  credits: z.number().default(0),
  credits_reset_at: z.string().default(''),
  whop_membership_id: z.string().default(''),
})
export type AuthUser = z.infer<typeof AuthUserSchema>
