import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export function Home() {
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetch('/api/hello')
      .then((r) => r.json())
      .then((d) => setMessage(d.message))
  }, [])

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Vite + React + Hono 🔥</CardTitle>
          <CardDescription>Fullstack app yang ringan & cepat</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Pesan dari Hono: <Badge variant="secondary">{message}</Badge>
          </p>
          <div className="flex gap-2">
            <Badge variant="outline">Vite</Badge>
            <Badge variant="outline">React</Badge>
            <Badge variant="outline">Hono</Badge>
            <Badge variant="outline">shadcn/ui</Badge>
          </div>
          <a href="/todos">
            <Button className="w-full">Coba Todo App →</Button>
          </a>
        </CardContent>
      </Card>
    </div>
  )
}
