/**
 * OpenAPI Common Config
 *
 * Edit this file to match your app's identity.
 * This is the shared foundation for the Swagger spec.
 */

export const info = {
  title: 'Vite Hono API',
  description:
    'Public API documentation. Use your API Key (X-Api-Key header) to authenticate.',
  version: '1.0.0',
  contact: {
    email: 'dev@example.com',
  },
}

export const servers = [
  {
    url: 'http://localhost:3000',
    description: 'Local Development',
  },
  // Add production server here after deploy:
  // { url: 'https://your-app.example.com', description: 'Production' },
]

export const securitySchemes = {
  bearerAuth: {
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
    description: 'Supabase JWT token (for dashboard/user routes)',
  },
  apiKeyAuth: {
    type: 'apiKey',
    in: 'header',
    name: 'X-Api-Key',
    description: 'API Key from /api-keys page (for public API routes)',
  },
}

export const securityJwt = [{ bearerAuth: [] }]
export const securityApiKey = [{ apiKeyAuth: [] }]
