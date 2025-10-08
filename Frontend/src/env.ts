// Environment variables for Vite
// Vite replaces import.meta.env.VITE_* at build time
export const env = {
  appName: (import.meta.env.VITE_APP_NAME ?? 'bonÀreaGo') as string,
  oidcIssuer: (import.meta.env.VITE_OIDC_ISSUER ?? import.meta.env.VITE_OIDC_ISSUER_URI ?? '') as string,
  oidcClientId: (import.meta.env.VITE_OIDC_CLIENT_ID ?? '') as string,
  oidcRedirectUri: (import.meta.env.VITE_OIDC_REDIRECT_URI ?? (typeof window !== 'undefined' ? window.location.origin : '')) as string,
  apiBaseUrl: (import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080') as string,
  authDisabled: (import.meta.env.VITE_AUTH_DISABLED === 'true') as boolean,
};

