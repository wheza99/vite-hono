import { useState } from 'react'
import { useAuth } from '@/lib/auth'
import { useNavigate, Link } from 'react-router'
import { authFetch } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
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
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

interface ApiKey {
  accessKey: string
  name: string
  createdAt: string
}

interface NewKeyResponse {
  accessKey: string
  secretKey: string
}

export function ApiKeys() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [keys, setKeys] = useState<ApiKey[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [newKeyName, setNewKeyName] = useState('')
  const [newKeyResult, setNewKeyResult] = useState<NewKeyResponse | null>(null)
  const [copied, setCopied] = useState<string | null>(null)

  const fetchKeys = async () => {
    const res = await authFetch('/api/keys')
    const data = await res.json()
    setKeys(data)
    setLoading(false)
  }

  useState(() => {
    fetchKeys()
  })

  const createKey = async () => {
    const res = await authFetch('/api/keys', {
      method: 'POST',
      body: JSON.stringify({ name: newKeyName || user?.email }),
    })
    const data = await res.json()
    setNewKeyResult(data)
    setNewKeyName('')
    fetchKeys()
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

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
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
                  <div className="flex gap-2">
                    <code className="flex-1 rounded bg-muted px-3 py-2 text-sm font-mono">
                      {newKeyName || user?.email}
                    </code>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Access Key</Label>
                  <div className="flex gap-2">
                    <code className="flex-1 rounded bg-muted px-3 py-2 text-sm font-mono break-all">
                      {newKeyResult.accessKey}
                    </code>
                    <Button
                      variant="outline" size="sm"
                      onClick={() => copyToClipboard(newKeyResult.accessKey, 'access')}
                    >
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
                    <Button
                      variant="outline" size="sm"
                      onClick={() => copyToClipboard(newKeyResult.secretKey, 'secret')}
                    >
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
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Belum ada API key.</p>
            <p className="text-muted-foreground text-sm mt-1">
              Klik "Buat API Key" untuk mulai.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {keys.map((key) => (
            <Card key={key.accessKey}>
              <CardContent className="flex items-center justify-between py-4">
                <div className="flex-1">
                  <p className="font-medium">{key.name}</p>
                  <p className="text-sm text-muted-foreground font-mono">
                    {key.accessKey.slice(0, 12)}...{key.accessKey.slice(-4)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Dibuat: {new Date(key.createdAt).toLocaleDateString('id-ID')}
                  </p>
                </div>
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
                        Key <code className="text-xs">{key.accessKey.slice(0, 12)}...</code> akan dihapus permanen. Aplikasi yang pakai key ini akan kehilangan akses.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Batal</AlertDialogCancel>
                      <AlertDialogAction onClick={() => deleteKey(key.accessKey)}>
                        Ya, Hapus
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-base">📖 Cara Pakai</CardTitle>
          <CardDescription>Kirim API key via header</CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="rounded bg-muted p-3 text-xs font-mono overflow-x-auto">
{`# GET request
curl http://localhost:3000/api/public/todos \\
  -H "X-Access-Key: ak_xxxxx..." \\
  -H "X-Secret-Key: sk_xxxxx..."

# Response
{ "data": [...] }

# Stats
curl http://localhost:3000/api/public/stats \\
  -H "X-Access-Key: ak_xxxxx..." \\
  -H "X-Secret-Key: sk_xxxxx..."`}
          </pre>
        </CardContent>
      </Card>
    </div>
  )
}
