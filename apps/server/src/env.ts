import 'dotenv/config'
import { z } from 'zod'

const EnvSchema = z.object({
  PORT: z.coerce.number().default(3000),
  POCKETBASE_URL: z.string().default('http://localhost:8090'),
  POCKETBASE_ADMIN_EMAIL: z.string().min(1),
  POCKETBASE_ADMIN_PASSWORD: z.string().min(1),
  WHOP_API_KEY: z.string().optional(),
  WHOP_COMPANY_ID: z.string().optional(),
  WHOP_ACCESS_PASS_ID: z.string().optional(),
  WHOP_WEBHOOK_SECRET: z.string().optional(),
  TURNSTILE_SECRET_KEY: z.string().optional(),
  CORS_ORIGIN: z.string().default('http://localhost:2000'),
})

export type Env = z.infer<typeof EnvSchema>

const parsed = EnvSchema.safeParse(process.env)
if (!parsed.success) {
  console.error('❌ Invalid environment variables:')
  for (const issue of parsed.error.issues) {
    console.error(`  - ${issue.path.join('.')}: ${issue.message}`)
  }
  process.exit(1)
}

export const env: Env = parsed.data
