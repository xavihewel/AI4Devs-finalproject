export const env = {
  appName: import.meta.env.VITE_APP_NAME as string,
  oidcIssuer: import.meta.env.VITE_OIDC_ISSUER_URI as string,
  oidcClientId: import.meta.env.VITE_OIDC_CLIENT_ID as string,
  oidcRedirectUri: import.meta.env.VITE_OIDC_REDIRECT_URI as string,
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL as string,
};

