import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'

interface Todo {
  id: number
  text: string
  done: boolean
}

export function Todos() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [input, setInput] = useState('')

  const fetchTodos = () => {
    fetch('/api/todos')
      .then((r) => r.json())
      .then(setTodos)
  }

  useEffect(() => {
    fetchTodos()
  }, [])

  const addTodo = async () => {
    if (!input.trim()) return
    await fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: input }),
    })
    setInput('')
    fetchTodos()
  }

  const toggleTodo = async (id: number, done: boolean) => {
    await fetch(`/api/todos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ done: !done }),
    })
    fetchTodos()
  }

  const deleteTodo = async (id: number) => {
    await fetch(`/api/todos/${id}`, { method: 'DELETE' })
    fetchTodos()
  }

  const doneCount = todos.filter((t) => t.done).length

  return (
    <div className="max-w-xl mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            📝 Todos
            <Badge variant="secondary">
              {doneCount}/{todos.length} selesai
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add todo */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              addTodo()
            }}
            className="flex gap-2"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tambah todo..."
            />
            <Button type="submit">Add</Button>
          </form>

          {/* Todo list */}
          <div className="space-y-2">
            {todos.map((todo) => (
              <div
                key={todo.id}
                className="flex items-center gap-3 rounded-lg border px-4 py-3"
              >
                <Checkbox
                  checked={todo.done}
                  onCheckedChange={() => toggleTodo(todo.id, todo.done)}
                />
                <span className={`flex-1 ${todo.done ? 'line-through text-muted-foreground' : ''}`}>
                  {todo.text}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  onClick={() => deleteTodo(todo.id)}
                >
                  ✕
                </Button>
              </div>
            ))}
          </div>

          {todos.length === 0 && (
            <p className="text-center text-muted-foreground py-4">
              Belum ada todo. Tambah yang baru!
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
