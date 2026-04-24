/**
 * OpenAPI Spec Composer
 *
 * This is the single entry point that merges all parts into a complete OpenAPI 3.0 spec.
 * AI: when adding new path files, import and spread them into the `paths` object below.
 */

import { info, servers, securitySchemes } from './common'
import { schemas } from './schemas'
import { publicPaths } from './paths/public'
import { userPaths } from './paths/user'

export const swaggerSpec = {
  openapi: '3.0.0',
  info,
  servers,
  components: {
    securitySchemes,
    schemas,
  },
  paths: {
    ...publicPaths,
    ...userPaths,
  },
}
