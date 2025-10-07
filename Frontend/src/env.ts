// Detect Vite env safely without using `typeof import`
let viteEnv: any = undefined;
try {
  // @ts-ignore
  if (typeof importMeta !== 'undefined') {
    // no-op, placeholder for TS
  }
  // eslint-disable-next-line no-eval
  const meta: any = (0, eval)('import.meta');
  viteEnv = meta && meta.env ? meta.env : undefined;
} catch (_) {
  viteEnv = undefined;
}

export const env = {
  appName: (viteEnv?.VITE_APP_NAME ?? process.env.VITE_APP_NAME ?? 'Covoituraje') as string,
  oidcIssuer: (viteEnv?.VITE_OIDC_ISSUER_URI ?? process.env.VITE_OIDC_ISSUER_URI ?? '') as string,
  oidcClientId: (viteEnv?.VITE_OIDC_CLIENT_ID ?? process.env.VITE_OIDC_CLIENT_ID ?? '') as string,
  oidcRedirectUri: (viteEnv?.VITE_OIDC_REDIRECT_URI ?? process.env.VITE_OIDC_REDIRECT_URI ?? '') as string,
  apiBaseUrl: (viteEnv?.VITE_API_BASE_URL ?? process.env.VITE_API_BASE_URL ?? 'http://localhost:8080') as string,
};

