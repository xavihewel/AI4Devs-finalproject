import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthProvider';

export const Protected: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { initialized, authenticated, login } = useAuth();
  const location = useLocation();

  if (!initialized) return null;
  if (!authenticated) {
    login();
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  return <>{children}</>;
};

