/**
 * PocketBase helper for server-side operations
 * Uses admin auth for all DB operations
 */

const PB_URL = process.env.POCKETBASE_URL || 'http://localhost:8090'
const PB_ADMIN_EMAIL = process.env.POCKETBASE_ADMIN_EMAIL || ''
const PB_ADMIN_PASSWORD = process.env.POCKETBASE_ADMIN_PASSWORD || ''

let adminToken = ''
let adminTokenExpiry = 0

// ── Admin auth ──────────────────────────────────────────────

export async function getAdminToken(): Promise<string> {
  // Reuse token if still valid (refresh 5 min before expiry)
  if (adminToken && Date.now() < adminTokenExpiry - 300_000) {
    return adminToken
  }

  const res = await fetch(`${PB_URL}/api/collections/_superusers/auth-with-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      identity: PB_ADMIN_EMAIL,
      password: PB_ADMIN_PASSWORD,
    }),
  })

  if (!res.ok) {
    throw new Error(`PB admin auth failed: ${res.status}`)
  }

  const data = await res.json()
  adminToken = data.token
  // PB tokens last 24h by default
  adminTokenExpiry = Date.now() + 24 * 60 * 60 * 1000
  return adminToken
}

// ── Generic CRUD helpers ────────────────────────────────────

async function adminHeaders() {
  const token = await getAdminToken()
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  }
}

export async function pbList(collection: string, filter?: string, sort?: string) {
  const params = new URLSearchParams()
  if (filter) params.set('filter', filter)
  if (sort) params.set('sort', sort)
  const qs = params.toString()

  const res = await fetch(`${PB_URL}/api/collections/${collection}/records${qs ? '?' + qs : ''}`, {
    headers: await adminHeaders(),
  })
  if (!res.ok) throw new Error(`pbList ${collection} failed: ${await res.text()}`)
  const data = await res.json()
  return data.items || []
}

export async function pbView(collection: string, id: string) {
  const res = await fetch(`${PB_URL}/api/collections/${collection}/records/${id}`, {
    headers: await adminHeaders(),
  })
  if (!res.ok) throw new Error(`pbView ${collection}/${id} failed: ${await res.text()}`)
  return res.json()
}

export async function pbCreate(collection: string, data: Record<string, any>) {
  const res = await fetch(`${PB_URL}/api/collections/${collection}/records`, {
    method: 'POST',
    headers: await adminHeaders(),
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error(`pbCreate ${collection} failed: ${await res.text()}`)
  return res.json()
}

export async function pbUpdate(collection: string, id: string, data: Record<string, any>) {
  const res = await fetch(`${PB_URL}/api/collections/${collection}/records/${id}`, {
    method: 'PATCH',
    headers: await adminHeaders(),
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error(`pbUpdate ${collection}/${id} failed: ${await res.text()}`)
  return res.json()
}

export async function pbDelete(collection: string, id: string) {
  const res = await fetch(`${PB_URL}/api/collections/${collection}/records/${id}`, {
    method: 'DELETE',
    headers: await adminHeaders(),
  })
  if (!res.ok) throw new Error(`pbDelete ${collection}/${id} failed: ${await res.text()}`)
}

export async function pbFirst(collection: string, filter: string) {
  const items = await pbList(collection, filter)
  return items[0] || null
}

// ── User auth verification ──────────────────────────────────

export async function verifyUserToken(token: string) {
  const res = await fetch(`${PB_URL}/api/collections/users/auth-refresh`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
  })
  if (!res.ok) return null
  const data = await res.json()
  return data.record || null
}
