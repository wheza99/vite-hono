import { z } from 'zod'

// ── Todos (placeholder resource — replace with your own domain) ──

export const TodoPrioritySchema = z.enum(['high', 'medium', 'low'])
export type TodoPriority = z.infer<typeof TodoPrioritySchema>

export const TodoSchema = z.object({
  id: z.string(),
  text: z.string(),
  done: z.boolean(),
  priority: TodoPrioritySchema.default('medium'),
  user_id: z.string(),
  created: z.string(),
  updated: z.string().optional(),
})
export type Todo = z.infer<typeof TodoSchema>

export const CreateTodoSchema = z.object({
  text: z.string().min(1).max(500),
  priority: TodoPrioritySchema.optional(),
})
export type CreateTodo = z.infer<typeof CreateTodoSchema>

export const UpdateTodoSchema = z.object({
  text: z.string().min(1).max(500).optional(),
  done: z.boolean().optional(),
  priority: TodoPrioritySchema.optional(),
})
export type UpdateTodo = z.infer<typeof UpdateTodoSchema>

// ── API Keys ─────────────────────────────────────────────────

export const CreateApiKeySchema = z.object({
  name: z.string().max(100).optional(),
})
export type CreateApiKey = z.infer<typeof CreateApiKeySchema>

export const ApiKeyResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  keyPrefix: z.string(),
  keySuffix: z.string(),
  createdAt: z.string(),
  lastUsedAt: z.string().nullable().optional(),
  expiresAt: z.string().nullable().optional(),
  rawKey: z.string().optional(), // only present on creation
})
export type ApiKeyResponse = z.infer<typeof ApiKeyResponseSchema>

// ── Errors ───────────────────────────────────────────────────

export const ApiErrorSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
  }),
})
export type ApiError = z.infer<typeof ApiErrorSchema>
