import { useEffect, useState } from 'react'
import { authFetch } from '@/lib/api'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Trash2 } from 'lucide-react'

interface Todo {
  id: number
  text: string
  done: boolean
}

export function Dashboard() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [newTodoText, setNewTodoText] = useState('')

  const fetchTodos = async () => {
    try {
      const res = await authFetch('/api/todos')
      const data = await res.json()
      setTodos(data)
    } catch (err) {
      console.error('Failed to fetch todos:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTodos()
  }, [])

  const addTodo = async () => {
    if (!newTodoText.trim()) return
    await authFetch('/api/todos', {
      method: 'POST',
      body: JSON.stringify({ text: newTodoText }),
    })
    setNewTodoText('')
    setDialogOpen(false)
    fetchTodos()
  }

  const toggleTodo = async (id: number, done: boolean) => {
    await authFetch(`/api/todos/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ done: !done }),
    })
    fetchTodos()
  }

  const deleteTodo = async (id: number) => {
    if (!confirm('Hapus todo ini?')) return
    await authFetch(`/api/todos/${id}`, { method: 'DELETE' })
    fetchTodos()
  }

  const doneCount = todos.filter((t) => t.done).length

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Kelola todo list kamu
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) setNewTodoText('') }}>
          <DialogTrigger asChild>
            <Button>Tambah Todo</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Todo Baru</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="todoText">Todo</Label>
                <Input
                  id="todoText"
                  placeholder="contoh: Belajar Hono"
                  value={newTodoText}
                  onChange={(e) => setNewTodoText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addTodo()}
                />
              </div>
              <Button onClick={addTodo} className="w-full">Tambah</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-4 mb-4">
        <div className="rounded-md border px-4 py-3 flex-1 text-center">
          <p className="text-2xl font-bold">{todos.length}</p>
          <p className="text-sm text-muted-foreground">Total</p>
        </div>
        <div className="rounded-md border px-4 py-3 flex-1 text-center">
          <p className="text-2xl font-bold">{doneCount}</p>
          <p className="text-sm text-muted-foreground">Selesai</p>
        </div>
        <div className="rounded-md border px-4 py-3 flex-1 text-center">
          <p className="text-2xl font-bold">{todos.length - doneCount}</p>
          <p className="text-sm text-muted-foreground">Pending</p>
        </div>
      </div>

      {loading ? (
        <p className="text-center text-muted-foreground py-8">Loading...</p>
      ) : todos.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>Belum ada todo.</p>
          <p className="text-sm mt-1">Klik "Tambah Todo" untuk mulai.</p>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">Status</TableHead>
                <TableHead>Todo</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {todos.map((todo) => (
                <TableRow key={todo.id}>
                  <TableCell>
                    <Checkbox
                      checked={todo.done}
                      onCheckedChange={() => toggleTodo(todo.id, todo.done)}
                    />
                  </TableCell>
                  <TableCell>
                    <span className={todo.done ? 'line-through text-muted-foreground' : ''}>
                      {todo.text}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => deleteTodo(todo.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
