/**
 * OpenAPI Paths — User API (JWT Auth)
 *
 * These are the routes under /api/* that require Supabase JWT.
 * Only visible in Swagger for reference — users typically interact via the dashboard.
 */

import { securityJwt } from '../common'

export const userPaths = {
  '/api/todos': {
    get: {
      tags: ['Todos'],
      summary: 'List todos',
      security: securityJwt,
      responses: {
        '200': { description: 'Success' },
      },
    },
    post: {
      tags: ['Todos'],
      summary: 'Create todo',
      security: securityJwt,
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['text'],
              properties: {
                text: { type: 'string', description: 'Todo text (format: "priority:text")' },
              },
            },
          },
        },
      },
      responses: {
        '201': { description: 'Created' },
      },
    },
  },
  '/api/todos/{id}': {
    put: {
      tags: ['Todos'],
      summary: 'Update todo',
      security: securityJwt,
      parameters: [
        { name: 'id', in: 'path', required: true, schema: { type: 'number' } },
      ],
      requestBody: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                text: { type: 'string' },
                done: { type: 'boolean' },
                priority: { type: 'string', enum: ['high', 'medium', 'low'] },
              },
            },
          },
        },
      },
      responses: {
        '200': { description: 'Updated' },
      },
    },
    delete: {
      tags: ['Todos'],
      summary: 'Delete todo',
      security: securityJwt,
      parameters: [
        { name: 'id', in: 'path', required: true, schema: { type: 'number' } },
      ],
      responses: {
        '200': { description: 'Deleted' },
      },
    },
  },
  '/api/keys': {
    get: {
      tags: ['API Keys'],
      summary: 'List API keys',
      security: securityJwt,
      responses: { '200': { description: 'Success' } },
    },
    post: {
      tags: ['API Keys'],
      summary: 'Create API key',
      security: securityJwt,
      requestBody: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: { name: { type: 'string' } },
            },
          },
        },
      },
      responses: { '201': { description: 'Created' } },
    },
  },
  '/api/keys/{id}': {
    delete: {
      tags: ['API Keys'],
      summary: 'Delete API key',
      security: securityJwt,
      parameters: [
        { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
      ],
      responses: { '200': { description: 'Deleted' } },
    },
  },
}
