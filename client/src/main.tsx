import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router'
import { Button } from '@/components/ui/button'
import { AuthProvider, useAuth } from '@/lib/auth'
import { Home } from './pages/Home'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { Todos } from './pages/Todos'
import './index.css'

function Navbar() {
  const { user, signOut } = useAuth()

  return (
    <nav className="flex items-center justify-between px-6 py-3 border-b">
      <div className="flex items-center gap-1">
        <Link to="/">
          <Button variant="ghost" size="sm">Home</Button>
        </Link>
        {user && (
          <Link to="/todos">
            <Button variant="ghost" size="sm">Todos</Button>
          </Link>
        )}
      </div>
      <div className="flex items-center gap-2">
        {user ? (
          <>
            <span className="text-sm text-muted-foreground">{user.email}</span>
            <Button variant="outline" size="sm" onClick={signOut}>
              Logout
            </Button>
          </>
        ) : (
          <>
            <Link to="/login">
              <Button variant="ghost" size="sm">Login</Button>
            </Link>
            <Link to="/register">
              <Button size="sm">Daftar</Button>
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/todos"
            element={
              <ProtectedRoute>
                <Todos />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
