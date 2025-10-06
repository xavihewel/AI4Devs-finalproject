import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getKeycloak } from './keycloak';
import { env } from '../env';

type AuthContextType = {
  initialized: boolean;
  authenticated: boolean;
  token?: string;
  login: () => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  initialized: false,
  authenticated: false,
  login: () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [initialized, setInitialized] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [token, setToken] = useState<string | undefined>(undefined);

  useEffect(() => {
    let refreshHandle: number | undefined;
    const keycloak = getKeycloak();
    if (!keycloak) {
      // No OIDC config available in env (e.g., tests). Mark as initialized but not authenticated.
      setInitialized(true);
      setAuthenticated(false);
      setToken(undefined);
      return;
    }
    keycloak
      .init({
        onLoad: 'check-sso',
        pkceMethod: 'S256',
        checkLoginIframe: false,
        redirectUri: env.oidcRedirectUri,
      })
      .then((auth) => {
        setInitialized(true);
        setAuthenticated(!!auth);
        setToken(keycloak.token ?? undefined);
        if (auth) {
          const schedule = async () => {
            const refreshed = await keycloak.updateToken(60).catch(() => false);
            if (refreshed) setToken(keycloak.token ?? undefined);
          };
          refreshHandle = window.setInterval(schedule, 30000);
        }
      })
      .catch(() => setInitialized(true));

    return () => {
      if (refreshHandle) window.clearInterval(refreshHandle);
    };
  }, []);

  const value = useMemo(
    () => ({
      initialized,
      authenticated,
      token,
      login: () => keycloak.login({ redirectUri: env.oidcRedirectUri }),
      logout: () => keycloak.logout({ redirectUri: window.location.origin }),
    }),
    [initialized, authenticated, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

