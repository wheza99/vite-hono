import { pbCreate, pbList, pbFirst, pbUpdate } from './pb'

/**
 * Payments Management — Tripay integration + PocketBase
 */

// ── CRUD ───────────────────────────────────────────────────

export async function createPayment(
  userId: string,
  userEmail: string,
  amount: number,
  method: string = 'QRIS',
  returnUrl: string = ''
) {
  if (!amount || amount < 1000) {
    throw new Error('Minimum top up Rp 1.000')
  }

  const { TRIPAY_API_KEY, TRIPAY_PRIVATE_KEY, TRIPAY_MERCHANT_CODE, TRIPAY_API_URL } = process.env

  if (!TRIPAY_API_KEY || !TRIPAY_PRIVATE_KEY || !TRIPAY_MERCHANT_CODE) {
    throw new Error('Payment gateway not configured')
  }

  const baseUrl = TRIPAY_API_URL || 'https://tripay.co.id/api'
  const crypto = await import('crypto')
  const axios = (await import('axios')).default

  const timestamp = Math.floor(Date.now() / 1000)
  const random = Math.floor(Math.random() * 10000)
  const merchant_ref = `TOPUP-${timestamp}-${random}`

  const signature = crypto
    .createHmac('sha256', TRIPAY_PRIVATE_KEY)
    .update(TRIPAY_MERCHANT_CODE + merchant_ref + String(amount))
    .digest('hex')

  const expiredTime = Math.floor(Date.now() / 1000) + (24 * 60 * 60)

  const response = await axios.post(`${baseUrl}/transaction/create`, {
    method,
    merchant_ref,
    amount,
    customer_name: userEmail.split('@')[0],
    customer_email: userEmail,
    customer_phone: '',
    order_items: [{
      sku: 'CREDIT-TOPUP',
      name: 'Credit Top Up',
      price: amount,
      quantity: 1,
    }],
    expired_time: expiredTime,
    return_url: returnUrl,
    signature,
  }, {
    headers: { Authorization: `Bearer ${TRIPAY_API_KEY}` },
    validateStatus: (status: number) => status < 999,
  })

  if (!response.data.success) {
    throw new Error(response.data.message || 'Failed to create Tripay transaction')
  }

  const data = await pbCreate('payments', {
    user_id: userId,
    amount,
    status: 'open',
    url: response.data.data?.checkout_url || '',
    metadata: {
      merchant_ref,
      method,
      qr_url: response.data.data?.qr_url,
      reference: response.data.data?.reference,
      tripay_response: response.data.data,
    },
  })

  return data
}

export async function listPayments(userId: string) {
  const items = await pbList('payments', `user_id='${userId}'`, '-created')
  return items
}

export async function getPayment(userId: string, paymentId: string) {
  const data = await pbFirst('payments', `id='${paymentId}' && user_id='${userId}'`)
  if (!data) throw new Error('Payment not found')
  return data
}

/**
 * Check payment status from Tripay and update DB
 */
export async function checkAndUpdatePaymentStatus(paymentId: string) {
  const payment = await pbFirst('payments', `id='${paymentId}'`)
  if (!payment) throw new Error('Payment not found')
  if (payment.status !== 'open') return payment

  const tripayRef = payment.metadata?.reference
  if (!tripayRef) return payment

  const TRIPAY_API_KEY = process.env.TRIPAY_API_KEY!
  const baseUrl = process.env.TRIPAY_API_URL || 'https://tripay.co.id/api'
  const axios = (await import('axios')).default

  const response = await axios.get(`${baseUrl}/transaction/detail`, {
    params: { reference: tripayRef },
    headers: { Authorization: `Bearer ${TRIPAY_API_KEY}` },
  })

  if (!response.data.success) {
    throw new Error('Failed to check Tripay status')
  }

  const tripayStatus = response.data.data?.status
  const statusMap: Record<string, string> = {
    PAID: 'paid',
    UNPAID: 'open',
    PENDING: 'open',
    EXPIRED: 'expired',
    CANCELED: 'void',
    FAILED: 'void',
    REFUND: 'refund',
  }
  const newStatus = statusMap[tripayStatus] || 'open'

  if (newStatus === 'open') return payment

  const updatedPayment = await pbUpdate('payments', paymentId, { status: newStatus })

  // If PAID → add credits + create transaction
  if (tripayStatus === 'PAID') {
    const existingCredit = await pbFirst('credits', `user_id='${payment.user_id}'`)

    if (existingCredit) {
      await pbUpdate('credits', existingCredit.id, {
        total: (existingCredit.total || 0) + payment.amount,
      })
    } else {
      await pbCreate('credits', {
        user_id: payment.user_id,
        total: payment.amount,
      })
    }

    await pbCreate('transactions', {
      user_id: payment.user_id,
      description: 'Credit Top Up',
      amount: payment.amount,
      type: 'credit',
      metadata: { payment_id: payment.id },
    })
  }

  return updatedPayment || payment
}
