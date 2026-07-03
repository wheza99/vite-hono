/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TURNSTILE_SITE_KEY: string
  readonly VITE_PB_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module 'swagger-ui-dist/swagger-ui-bundle' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const SwaggerUIBundle: any
  export default SwaggerUIBundle
}
