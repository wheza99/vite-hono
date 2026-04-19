import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Link } from 'react-router'
import { Button } from '@/components/ui/button'
import { Home } from './pages/Home'
import { Todos } from './pages/Todos'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <nav className="flex items-center gap-2 px-6 py-4 border-b">
        <Link to="/">
          <Button variant="ghost">Home</Button>
        </Link>
        <Link to="/todos">
          <Button variant="ghost">Todos</Button>
        </Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/todos" element={<Todos />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
