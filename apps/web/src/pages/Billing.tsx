import { useState, useEffect, useCallback } from 'react'
import { authFetch } from '@/lib/api'
import type { CreditsResponse, Transaction } from '@vite-hono/shared'
import { WhopCheckoutEmbed } from '@whop/checkout/react'
import { Coins, Crown, Receipt, Loader2 } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
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

export function Billing() {
  const [credits, setCredits] = useState<CreditsResponse | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [checkoutError, setCheckoutError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      const [creditsRes, transactionsRes] = await Promise.all([
        authFetch('/api/credits'),
        authFetch('/api/transactions'),
      ])
      setCredits(await creditsRes.json())
      setTransactions(await transactionsRes.json())
    } catch (err) {
      console.error('Failed to fetch billing data:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const startCheckout = async () => {
    setCheckoutLoading(true)
    setCheckoutError(null)
    try {
      const res = await authFetch('/api/billing/checkout', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) {
        setCheckoutError(data?.error?.message || 'Gagal memulai checkout')
        return
      }
      setSessionId(data.sessionId)
    } catch (err) {
      console.error('Failed to start checkout:', err)
      setCheckoutError('Gagal memulai checkout')
    } finally {
      setCheckoutLoading(false)
    }
  }

  const isPro = credits?.plan === 'pro'

  return (
    <div className="max-w-7xl mx-auto py-8 px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Billing</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Kelola subscription dan riwayat transaksi
        </p>
      </div>

      {/* Plan + credits */}
      <div className="rounded-md border px-6 py-4 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="rounded-full bg-primary/10 p-3">
            <Coins className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Credits tersisa</p>
            <p className="text-2xl font-bold">{loading ? '...' : credits?.credits ?? 0}</p>
            {credits?.resetsAt && (
              <p className="text-xs text-muted-foreground">
                Reset {new Date(credits.resetsAt).toLocaleDateString('id-ID')}
              </p>
            )}
          </div>
        </div>
        <Badge variant={isPro ? 'default' : 'secondary'} className={isPro ? 'bg-amber-600' : ''}>
          {isPro && <Crown className="h-3 w-3 mr-1" />}
          {isPro ? 'Pro' : 'Free'}
        </Badge>
      </div>

      {/* Upgrade */}
      {!loading && !isPro && (
        <div className="rounded-md border px-6 py-4 mb-6">
          <h2 className="font-semibold">Upgrade ke Pro — $10/bulan</h2>
          <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
            <li>✓ 100 credits per bulan</li>
            <li>✓ Akses fitur Pro</li>
          </ul>
          {checkoutError && <p className="text-sm text-destructive mt-2">{checkoutError}</p>}
          {!sessionId ? (
            <Button className="mt-4" onClick={startCheckout} disabled={checkoutLoading}>
              {checkoutLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Memuat...
                </>
              ) : (
                'Upgrade Sekarang'
              )}
            </Button>
          ) : (
            <div className="mt-4 overflow-hidden rounded-md border bg-background">
              <WhopCheckoutEmbed
                sessionId={sessionId}
                returnUrl={`${window.location.origin}/billing?checkout=done`}
                onComplete={() => {
                  setSessionId(null)
                  setTimeout(() => fetchData(), 3000)
                }}
              />
            </div>
          )}
        </div>
      )}

      {/* Transactions */}
      <div className="flex items-center gap-2 mb-4">
        <Receipt className="h-4 w-4" />
        <h2 className="font-semibold">Transaction History</h2>
      </div>
      {loading ? (
        <p className="text-center text-muted-foreground py-8">Loading...</p>
      ) : transactions.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>Belum ada transaksi.</p>
          <p className="text-sm mt-1">Transaksi kamu akan muncul di sini.</p>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-8 w-1/3">Tanggal</TableHead>
                <TableHead className="py-2"><Separator orientation="vertical" /></TableHead>
                <TableHead className="w-1/3">Deskripsi</TableHead>
                <TableHead className="py-2"><Separator orientation="vertical" /></TableHead>
                <TableHead className="w-1/3">Credits</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell className="pl-8 text-muted-foreground">
                    {new Date(tx.created).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </TableCell>
                  <TableCell></TableCell>
                  <TableCell className="font-medium">{tx.description}</TableCell>
                  <TableCell></TableCell>
                  <TableCell className={tx.type === 'credit' ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}>
                    {tx.type === 'credit' ? '+' : '-'}{tx.amount}
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
