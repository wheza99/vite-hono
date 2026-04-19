import { useState, useEffect, useCallback } from 'react'
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
import { Copy, Check, Trash2 } from 'lucide-react'

interface ApiKey {
  id: string
  name: string
  keyPrefix: string
  keySuffix: string
  createdAt: string
  lastUsedAt: string | null
  expiresAt: string | null
}

interface NewKeyResponse {
  id: string
  name: string
  keyPrefix: string
  keySuffix: string
  createdAt: string
  rawKey: string
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

  const deleteKey = async (id: string) => {
    if (!confirm('Hapus API key ini?')) return
    await authFetch(`/api/keys/${id}`, { method: 'DELETE' })
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

  return (
    <div className="max-w-7xl mx-auto py-8 px-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">API Keys</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Kelola API key untuk akses public API
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) closeDialog() }}>
          <DialogTrigger asChild>
            <Button>Buat API Key</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {newKeyResult ? 'API Key Dibuat!' : 'Buat API Key Baru'}
              </DialogTitle>
            </DialogHeader>

            {newKeyResult ? (
              <div className="space-y-4">
                <div className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  Copy secret key sekarang! Tidak akan ditampilkan lagi.
                </div>

                <div className="space-y-2">
                  <Label>Name</Label>
                  <code className="block rounded bg-muted px-3 py-2 text-sm font-mono">
                    {newKeyResult.name}
                  </code>
                </div>

                <div className="space-y-2">
                  <Label>API Key</Label>
                  <div className="flex gap-2">
                    <code className="flex-1 rounded bg-muted px-3 py-2 text-sm font-mono break-all">
                      {newKeyResult.rawKey}
                    </code>
                    <Button variant="outline" size="icon"
                      onClick={() => copyToClipboard(newKeyResult.rawKey, 'key')}>
                      {copied === 'key' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="pt-2">
                  <Label className="text-muted-foreground">Contoh Penggunaan</Label>
                  <pre className="mt-2 rounded bg-muted p-3 text-xs font-mono overflow-x-auto">
{`curl http://localhost:3000/api/public/todos \\
  -H "X-Api-Key: ${newKeyResult.rawKey}"`}
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
          <p className="text-sm mt-1">Klik "Buat API Key" untuk mulai.</p>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Key</TableHead>
                <TableHead>Dibuat</TableHead>
                <TableHead>Terakhir Digunakan</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {keys.map((key) => (
                <TableRow key={key.id}>
                  <TableCell className="font-medium">{key.name}</TableCell>
                  <TableCell>
                    <code className="rounded bg-muted px-2 py-1 text-xs font-mono">
                      {key.keyPrefix}...{key.keySuffix}
                    </code>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(key.createdAt).toLocaleDateString('id-ID')}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {key.lastUsedAt
                      ? new Date(key.lastUsedAt).toLocaleDateString('id-ID')
                      : '-'}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => deleteKey(key.id)}
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
