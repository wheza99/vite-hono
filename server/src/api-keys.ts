import crypto from 'crypto'

/**
 * API Key Management
 * 
 * Access Key = public identifier (kayak username)
 * Secret Key = used to sign requests (kayak password, tapi ga pernah dikirim langsung)
 * 
 * Client sign request pakai Secret Key → Server verifikasi signature
 */

interface ApiKey {
  accessKey: string
  secretKeyHash: string  // Secret key disimpan sebagai hash
  name: string
  createdAt: string
}

// In-memory store (production: simpan ke database)
let apiKeys: ApiKey[] = []

// Generate random hex string
function randomHex(bytes: number) {
  return crypto.randomBytes(bytes).toString('hex')
}

// Hash secret key (yang disimpan di DB)
function hashKey(key: string) {
  return crypto.createHash('sha256').update(key).digest('hex')
}

/**
 * Buat API key pair baru
 * Returns: { accessKey, secretKey } — secretKey cuma muncul sekali!
 */
export function createApiKey(name: string) {
  const accessKey = `ak_${randomHex(16)}`  // ak_xxxxx...
  const secretKey = `sk_${randomHex(32)}`  // sk_xxxxx...

  apiKeys.push({
    accessKey,
    secretKeyHash: hashKey(secretKey),
    name,
    createdAt: new Date().toISOString(),
  })

  return { accessKey, secretKey }
}

/**
 * List semua API keys (tanpa secret)
 */
export function listApiKeys() {
  return apiKeys.map(({ secretKeyHash: _, ...key }) => key)
}

/**
 * Delete API key
 */
export function deleteApiKey(accessKey: string) {
  apiKeys = apiKeys.filter((k) => k.accessKey !== accessKey)
}

/**
 * Verifikasi request signature
 * 
 * Client mengirim:
 *   Header: X-Access-Key: ak_xxxxx
 *   Header: X-Timestamp: 1713512345
 *   Header: X-Signature: HMAC-SHA256(secretKey, "GET /api/public/todos\n1713512345")
 * 
 * Server:
 *   1. Cari accessKey di DB
 *   2. Re-compute signature pakai secretKeyHash... wait, ini ga bisa
 * 
 * Hmm, problem: Secret key ga disimpan plain di server.
 * Makanya untuk HMAC signature, kita perlu simpan secret key yang bisa di-decrypt,
 * ATAU pakai approach yang lebih simple.
 * 
 * Biar simpel, kita pakai approach kayak Stripe:
 *   Client kirim access_key + secret_key langsung di header
 *   Server hash secret_key → compare dengan yang di DB
 */
export function verifyApiKey(accessKey: string, secretKey: string): boolean {
  const key = apiKeys.find((k) => k.accessKey === accessKey)
  if (!key) return false
  return key.secretKeyHash === hashKey(secretKey)
}
