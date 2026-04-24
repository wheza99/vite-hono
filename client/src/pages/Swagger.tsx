import { useEffect, useRef } from 'react'
import SwaggerUIBundle from 'swagger-ui-dist/swagger-ui-bundle'
import 'swagger-ui-dist/swagger-ui.css'
import { useAuth } from '@/lib/auth'
import { swaggerSpec } from '@/swagger/spec'

export function Swagger() {
  const swaggerRef = useRef<HTMLDivElement>(null)
  const { session } = useAuth()
  const token = session?.access_token

  useEffect(() => {
    if (!swaggerRef.current) return

    const ui = SwaggerUIBundle({
      spec: swaggerSpec,
      domNode: swaggerRef.current,
      presets: [
        SwaggerUIBundle.presets.apis,
        SwaggerUIBundle.SwaggerUIStandalonePreset,
      ],
      layout: 'BaseLayout',
      deepLinking: true,
      showExtensions: true,
      showCommonExtensions: true,
      requestInterceptor: (request: any) => {
        // Auto-inject JWT token for user-authenticated routes
        if (token) {
          request.headers.Authorization = `Bearer ${token}`
        }
        return request
      },
    })

    // Pre-authorize both schemes
    if (token) {
      ui.preauthorizeApiKey('bearerAuth', token)
    }
  }, [token])

  return (
    <div className="max-w-7xl mx-auto py-8 px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">API Documentation</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Interactive API reference. Your auth token is auto-injected for try-it-out.
        </p>
      </div>
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden bg-white">
        <div ref={swaggerRef} />
      </div>
    </div>
  )
}
