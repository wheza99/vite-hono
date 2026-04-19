import { CreditCard, Receipt, Wallet } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const payments = [
  {
    id: 1,
    method: 'Visa **** 4242',
    type: 'Credit Card',
    isDefault: true,
  },
  {
    id: 2,
    method: 'BCA **** 1234',
    type: 'Bank Transfer',
    isDefault: false,
  },
]

const transactions = [
  {
    id: 'TXN-001',
    date: '2026-04-19',
    description: 'Pro Plan - Monthly',
    amount: 'Rp 149.000',
    status: 'success' as const,
  },
  {
    id: 'TXN-002',
    date: '2026-03-19',
    description: 'Pro Plan - Monthly',
    amount: 'Rp 149.000',
    status: 'success' as const,
  },
  {
    id: 'TXN-003',
    date: '2026-02-19',
    description: 'Pro Plan - Monthly',
    amount: 'Rp 149.000',
    status: 'failed' as const,
  },
]

const statusVariant = {
  success: 'default' as const,
  failed: 'destructive' as const,
  pending: 'secondary' as const,
}

const statusLabel = {
  success: 'Berhasil',
  failed: 'Gagal',
  pending: 'Pending',
}

export function Billing() {
  return (
    <div className="max-w-7xl mx-auto py-8 px-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Billing</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Kelola metode pembayaran dan riwayat transaksi
          </p>
        </div>
        <Button>Tambah Credits</Button>
      </div>

      <div className="rounded-md border px-6 py-4 mb-6 flex items-center gap-4">
        <div className="rounded-full bg-muted p-3">
          <Wallet className="h-5 w-5 text-muted-foreground" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Credits</p>
          <p className="text-2xl font-bold">Rp 0</p>
        </div>
      </div>

      <Tabs defaultValue="payment">
        <TabsList>
          <TabsTrigger value="payment" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Payment
          </TabsTrigger>
          <TabsTrigger value="transaction" className="flex items-center gap-2">
            <Receipt className="h-4 w-4" />
            Transaction
          </TabsTrigger>
        </TabsList>

        <TabsContent value="payment" className="mt-6">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Metode</TableHead>
                  <TableHead>Tipe</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">{payment.method}</TableCell>
                    <TableCell>{payment.type}</TableCell>
                    <TableCell>
                      {payment.isDefault ? (
                        <Badge variant="default">Default</Badge>
                      ) : (
                        <Badge variant="outline">Aktif</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                      >
                        Hapus
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="transaction" className="mt-6">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Deskripsi</TableHead>
                  <TableHead>Jumlah</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell className="font-mono text-sm">{tx.id}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(tx.date).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </TableCell>
                    <TableCell>{tx.description}</TableCell>
                    <TableCell className="font-medium">{tx.amount}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariant[tx.status]}>
                        {statusLabel[tx.status]}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
