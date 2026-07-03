import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { pb } from '@/lib/pocketbase'

interface PBUser {
  id: string
  email: string
  name: string
  avatar: string
  [key: string]: any
}

interface AuthContextType {
  user: PBUser | null
  loading: boolean
  signUp: (email: string, password: string, turnstileToken: string | null) => Promise<{ error: string | null }>
  signIn: (email: string, password: string, turnstileToken: string | null) => Promise<{ error: string | null }>
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<PBUser | null>(null)
  const [loading, setLoading] = useState(true)

  // Helper: read current user from authStore
  function getCurrentUser(): PBUser | null {
    if (pb.authStore.isValid && pb.authStore.record) {
      return pb.authStore.record as unknown as PBUser
    }
    return null
  }

  useEffect(() => {
    // Set initial user from stored auth
    const initialUser = getCurrentUser()
    setUser(initialUser)
    setLoading(false)

    // Listen for auth changes (login, logout, token refresh)
    const unsub = pb.authStore.onChange(() => {
      const currentUser = getCurrentUser()
      setUser(currentUser)
    })

    return () => {
      if (typeof unsub === 'function') unsub()
    }
  }, [])

  // Email/password go through the backend (/api/auth/*) so the Turnstile check
  // is enforced server-side — a client can't skip the widget and hit PocketBase
  // directly. The backend returns { token, record }; we persist it to the SDK's
  // authStore, which the onChange listener above picks up.
  const signUp = async (email: string, password: string, turnstileToken: string | null) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, turnstileToken }),
      })
      const data = await res.json()
      if (!res.ok) return { error: data?.error || 'Registration failed' }
      pb.authStore.save(data.token, data.record)
      return { error: null }
    } catch {
      return { error: 'Network error. Please try again.' }
    }
  }

  const signIn = async (email: string, password: string, turnstileToken: string | null) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, turnstileToken }),
      })
      const data = await res.json()
      if (!res.ok) return { error: data?.error || 'Login failed' }
      pb.authStore.save(data.token, data.record)
      return { error: null }
    } catch {
      return { error: 'Network error. Please try again.' }
    }
  }

  // Google OAuth2 stays a direct browser→PocketBase popup flow (no backend
  // round-trip, no Turnstile — Google has its own bot protection and Turnstile
  // can't run inside a cross-origin OAuth popup).
  const signInWithGoogle = async () => {
    await pb.collection('users').authWithOAuth2({
      provider: 'google',
      scopes: ['email', 'profile'],
    })
    setUser(getCurrentUser())
  }

  const signOut = async () => {
    pb.authStore.clear()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
