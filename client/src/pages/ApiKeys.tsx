import { useState, useEffect, useMemo, useCallback, Component, type ReactNode } from 'react'
import { useAuth } from '@/lib/auth'
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'

interface ApiKey {
  accessKey: string
  name: string
  createdAt: string
}

interface NewKeyResponse {
  accessKey: string
  secretKey: string
}

// Error boundary biar ga blank page
class ErrorBoundary extends Component<{ children: ReactNode }, { error: string | null }> {
  state = { error: null as string | null }
  static getDerivedStateFromError(e: Error) {
    return { error: e.message }
  }
  render() {
    if (this.state.error) {
      return (
        <div className="max-w-3xl mx-auto py-8 px-4">
          <div className="rounded-md bg-destructive/10 px-4 py-3 text-destructive">
            <p className="font-bold">Error</p>
            <pre className="mt-2 text-xs whitespace-pre-wrap">{this.state.error}</pre>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

export function ApiKeys() {
  const { user } = useAuth()
  const [keys, setKeys] = useState<ApiKey[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [newKeyName, setNewKeyName] = useState('')
  const [newKeyResult, setNewKeyResult] = useState<NewKeyResponse | null>(null)
  const [copied, setCopied] = useState<string | null>(null)

  const fetchKeys = useCallback(async () => {
    try {
      const res = await authFetch('/api/keys')
      const data = await res.json()
      setKeys(data)
    } catch (err) {
      console.error('Failed to fetch keys:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchKeys()
  }, [fetchKeys])

  const createKey = async () => {
    try {
      const res = await authFetch('/api/keys', {
        method: 'POST',
        body: JSON.stringify({ name: newKeyName || user?.email }),
      })
      const data = await res.json()
      setNewKeyResult(data)
      setNewKeyName('')
      fetchKeys()
    } catch (err) {
      console.error('Failed to create key:', err)
    }
  }

  const deleteKey = async (accessKey: string) => {
    await authFetch(`/api/keys/${accessKey}`, { method: 'DELETE' })
    fetchKeys()
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    setCopied(label)
    setTimeout(() => setCopied(null), 2000)
  }

  const closeDialog = () => {
    setDialogOpen(false)
    setNewKeyResult(null)
    setNewKeyName('')
  }

  const columns = useMemo<ColumnDef<ApiKey>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Nama',
      },
      {
        accessorKey: 'accessKey',
        header: 'Access Key',
        cell: ({ row }) => (
          <code className="rounded bg-muted px-2 py-1 text-xs font-mono">
            {row.original.accessKey}
          </code>
        ),
      },
      {
        accessorKey: 'createdAt',
        header: 'Dibuat',
        cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString('id-ID'),
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                Hapus
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Hapus API Key?</AlertDialogTitle>
                <AlertDialogDescription>
                  Key <code className="text-xs">{row.original.accessKey}</code> akan dihapus permanen.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction onClick={() => deleteKey(row.original.accessKey)}>
                  Ya, Hapus
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ),
      },
    ],
    [] // eslint-disable-line react-hooks/exhaustive-deps
  )

  const table = useReactTable({
    data: keys,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <ErrorBoundary>
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">🔑 API Keys</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Kelola API key untuk akses public API
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) closeDialog() }}>
          <DialogTrigger asChild>
            <Button>+ Buat API Key</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {newKeyResult ? 'API Key Dibuat! ✅' : 'Buat API Key Baru'}
              </DialogTitle>
            </DialogHeader>

            {newKeyResult ? (
              <div className="space-y-4">
                <div className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  ⚠️ Copy secret key sekarang! Tidak akan ditampilkan lagi.
                </div>

                <div className="space-y-2">
                  <Label>Name</Label>
                  <code className="block rounded bg-muted px-3 py-2 text-sm font-mono">
                    {newKeyName || user?.email}
                  </code>
                </div>

                <div className="space-y-2">
                  <Label>Access Key</Label>
                  <div className="flex gap-2">
                    <code className="flex-1 rounded bg-muted px-3 py-2 text-sm font-mono break-all">
                      {newKeyResult.accessKey}
                    </code>
                    <Button variant="outline" size="sm"
                      onClick={() => copyToClipboard(newKeyResult.accessKey, 'access')}>
                      {copied === 'access' ? '✓' : 'Copy'}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Secret Key</Label>
                  <div className="flex gap-2">
                    <code className="flex-1 rounded bg-muted px-3 py-2 text-sm font-mono break-all">
                      {newKeyResult.secretKey}
                    </code>
                    <Button variant="outline" size="sm"
                      onClick={() => copyToClipboard(newKeyResult.secretKey, 'secret')}>
                      {copied === 'secret' ? '✓' : 'Copy'}
                    </Button>
                  </div>
                </div>

                <div className="pt-2">
                  <Label className="text-muted-foreground">Contoh Penggunaan</Label>
                  <pre className="mt-2 rounded bg-muted p-3 text-xs font-mono overflow-x-auto">
{`curl http://localhost:3000/api/public/todos \\
  -H "X-Access-Key: ${newKeyResult.accessKey}" \\
  -H "X-Secret-Key: ${newKeyResult.secretKey}"`}
                  </pre>
                </div>

                <Button onClick={closeDialog} className="w-full">Done</Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="keyName">Nama (opsional)</Label>
                  <Input
                    id="keyName"
                    placeholder="contoh: My Mobile App"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                  />
                </div>
                <Button onClick={createKey} className="w-full">Buat</Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <p className="text-center text-muted-foreground py-8">Loading...</p>
      ) : keys.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>Belum ada API key.</p>
          <p className="text-sm mt-1">Klik "+ Buat API Key" untuk mulai.</p>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
    </ErrorBoundary>
  )
}
