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
  signUp: (email: string, password: string) => Promise<{ error: string | null }>
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
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
      return pb.authStore.record as PBUser
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

  const signUp = async (email: string, password: string) => {
    try {
      await pb.collection('users').create({
        email,
        password,
        passwordConfirm: password,
        name: email.split('@')[0],
      })
      // Auto-login after signup
      await pb.collection('users').authWithPassword(email, password)
      return { error: null }
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || 'Registration failed'
      return { error: message }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      await pb.collection('users').authWithPassword(email, password)
      return { error: null }
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || 'Login failed'
      return { error: message }
    }
  }

  const signInWithGoogle = async () => {
    const authData = await pb.collection('users').authWithOAuth2({
      provider: 'google',
      scopes: ['email', 'profile'],
    })
    // Force update user state immediately
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
