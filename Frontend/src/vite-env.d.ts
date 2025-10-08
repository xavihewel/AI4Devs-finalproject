/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_NAME?: string
  readonly VITE_API_BASE_URL?: string
  readonly VITE_OIDC_ISSUER?: string
  readonly VITE_OIDC_ISSUER_URI?: string
  readonly VITE_OIDC_CLIENT_ID?: string
  readonly VITE_OIDC_REDIRECT_URI?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

