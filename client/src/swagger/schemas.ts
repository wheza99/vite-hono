/**
 * OpenAPI Schemas
 *
 * Define your response/request models here.
 * AI: when adding new tables, add corresponding schemas here.
 */

export const schemas = {
  // ── Base Response Schemas ────────────────────────────────
  ResponseList: {
    type: 'object',
    properties: {
      data: { type: 'array', items: { type: 'object' } },
    },
  },
  ResponseDetail: {
    type: 'object',
    properties: {
      data: { type: 'object' },
      message: { type: 'string' },
    },
  },
  ErrorResponse: {
    type: 'object',
    properties: {
      error: { type: 'string' },
    },
  },

  // ── Domain Schemas ───────────────────────────────────────
  Todo: {
    type: 'object',
    properties: {
      id: { type: 'number', description: 'Todo ID' },
      text: { type: 'string', description: 'Todo text' },
      done: { type: 'boolean', description: 'Completion status' },
      priority: { type: 'string', enum: ['high', 'medium', 'low'], description: 'Priority level' },
    },
  },
  Stats: {
    type: 'object',
    properties: {
      total: { type: 'number' },
      done: { type: 'number' },
      pending: { type: 'number' },
    },
  },
  ApiKey: {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' },
      name: { type: 'string' },
      keyPrefix: { type: 'string', description: 'First 7 chars (sk-xxxx)' },
      keySuffix: { type: 'string', description: 'Last 4 chars' },
      createdAt: { type: 'string', format: 'date-time' },
    },
  },
}
