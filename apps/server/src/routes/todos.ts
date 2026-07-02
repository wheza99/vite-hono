import { Hono } from 'hono'
import { CreateTodoSchema, UpdateTodoSchema, type Todo } from '@vite-hono/shared'
import { pbCreate, pbDelete, pbList, pbView, pbUpdate } from '../lib/pocketbase'
import { userAuth, type AuthVariables } from '../middleware/auth'

function toTodo(r: Record<string, unknown>): Todo {
  return {
    id: r.id as string,
    text: r.text as string,
    done: Boolean(r.done),
    priority: (r.priority as Todo['priority']) || 'medium',
    user_id: r.user_id as string,
    created: (r.created as string) ?? '',
    updated: (r.updated as string) ?? '',
  }
}

export const todosRoute = new Hono<{ Variables: AuthVariables }>()

todosRoute.use('*', userAuth)

todosRoute.get('/', async (c) => {
  const user = c.get('user')
  const items = await pbList('todos', `user_id='${user.id}'`, '-created')
  return c.json(items.map(toTodo))
})

todosRoute.get('/:id', async (c) => {
  const user = c.get('user')
  try {
    const record = await pbView('todos', c.req.param('id'))
    if (record.user_id !== user.id) {
      return c.json({ error: { code: 'not_found', message: 'Todo not found' } }, 404)
    }
    return c.json(toTodo(record))
  } catch {
    return c.json({ error: { code: 'not_found', message: 'Todo not found' } }, 404)
  }
})

todosRoute.post('/', async (c) => {
  const user = c.get('user')
  const parsed = CreateTodoSchema.safeParse(await c.req.json().catch(() => ({})))
  if (!parsed.success) {
    return c.json({ error: { code: 'invalid_body', message: parsed.error.issues[0]?.message ?? 'Invalid body' } }, 400)
  }
  const record = await pbCreate('todos', {
    user_id: user.id,
    text: parsed.data.text,
    done: false,
    priority: parsed.data.priority ?? 'medium',
  })
  return c.json(toTodo(record), 201)
})

todosRoute.put('/:id', async (c) => {
  const user = c.get('user')
  const parsed = UpdateTodoSchema.safeParse(await c.req.json().catch(() => ({})))
  if (!parsed.success) {
    return c.json({ error: { code: 'invalid_body', message: parsed.error.issues[0]?.message ?? 'Invalid body' } }, 400)
  }
  const existing = await pbView('todos', c.req.param('id')).catch(() => null)
  if (!existing || existing.user_id !== user.id) {
    return c.json({ error: { code: 'not_found', message: 'Todo not found' } }, 404)
  }
  const record = await pbUpdate('todos', existing.id, parsed.data)
  return c.json(toTodo(record))
})

todosRoute.delete('/:id', async (c) => {
  const user = c.get('user')
  const existing = await pbView('todos', c.req.param('id')).catch(() => null)
  if (!existing || existing.user_id !== user.id) {
    return c.json({ error: { code: 'not_found', message: 'Todo not found' } }, 404)
  }
  await pbDelete('todos', existing.id)
  return c.json({ ok: true })
})
