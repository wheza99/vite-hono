import crypto from 'node:crypto'
import { pbCreate, pbList, pbDelete, pbFirst, pbUpdate } from './pocketbase'

/**
 * API Key management — PocketBase-backed with SHA-256 hashing
 */

function randomHex(bytes: number) {
  return crypto.randomBytes(bytes).toString('hex')
}

function hashKey(key: string) {
  return crypto.createHash('sha256').update(key).digest('hex')
}

export interface ApiKeyInfo {
  id: string
  userId: string
  name: string
}

export async function createApiKey(userId: string, name: string) {
  const rawKey = `sk-${randomHex(16)}`
  const keyHash = hashKey(rawKey)

  const data = await pbCreate('api_keys', {
    user_id: userId,
    name: name || 'Default',
    key_hash: keyHash,
    key_prefix: rawKey.slice(0, 7),
    key_suffix: rawKey.slice(-4),
  })

  return {
    id: data.id,
    name: data.name,
    keyPrefix: data.key_prefix,
    keySuffix: data.key_suffix,
    createdAt: data.created,
    rawKey,
  }
}

export async function listApiKeys(userId: string) {
  const items = await pbList('api_keys', `user_id='${userId}'`, '-created')
  return items.map((row: Record<string, string>) => ({
    id: row.id,
    name: row.name,
    keyPrefix: row.key_prefix,
    keySuffix: row.key_suffix,
    createdAt: row.created,
    lastUsedAt: row.last_used_at || null,
    expiresAt: row.expires_at || null,
  }))
}

export async function deleteApiKey(userId: string, keyId: string) {
  // Verify ownership
  const items = await pbList('api_keys', `id='${keyId}' && user_id='${userId}'`)
  if (!items.length) throw new Error('API key not found')
  await pbDelete('api_keys', keyId)
}

export async function verifyApiKey(rawKey: string): Promise<ApiKeyInfo | null> {
  const keyHash = hashKey(rawKey)
  const data = await pbFirst('api_keys', `key_hash='${keyHash}'`)

  if (!data) return null

  if (data.expires_at && new Date(data.expires_at) < new Date()) {
    return null
  }

  // Update last_used_at (fire and forget)
  pbUpdate('api_keys', data.id, { last_used_at: new Date().toISOString() }).catch(() => {})

  return { id: data.id, userId: data.user_id, name: data.name }
}
