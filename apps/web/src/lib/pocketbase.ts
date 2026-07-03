import PocketBase from 'pocketbase'

// Connect to PocketBase through the Hono /pb proxy (same origin — the client
// never learns the real PB URL). Must be an ABSOLUTE base URL: with a relative
// or empty base the SDK resolves API paths against the current page path
// instead of the origin, which silently breaks on nested routes like /todos.
export const PB_URL = import.meta.env.VITE_PB_URL || `${window.location.origin}/pb`
export const pb = new PocketBase(PB_URL)

// Helper to get the current auth store
export function getPbToken() {
  return pb.authStore.token
}

export function isPbAuthenticated() {
  return pb.authStore.isValid
}
