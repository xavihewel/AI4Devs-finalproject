import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from './AuthProvider';

export const Protected: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { initialized, authenticated, login } = useAuth();
  const location = useLocation();

  if (!initialized) return null;
  if (!authenticated) {
    // Trigger login after mount; do not render a Navigate here to avoid redirect loops
    useEffect(() => {
      login();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return null;
  }
  return <>{children}</>;
};

