import PocketBase from 'pocketbase'

// Connect to PocketBase through Hono proxy
export const pb = new PocketBase('/pb')

// Helper to get the current auth store
export function getPbToken() {
  return pb.authStore.token
}

export function isPbAuthenticated() {
  return pb.authStore.isValid
}
