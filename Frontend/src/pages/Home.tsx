import React from 'react';
import { useAuth } from '../auth/AuthProvider';

export default function Home() {
  const { authenticated, login, logout } = useAuth();
  return (
    <div style={{ padding: 24 }}>
      <h1>Bienvenido a Covoituraje</h1>
      {authenticated ? <button onClick={logout}>Logout</button> : <button onClick={login}>Login</button>}
    </div>
  );
}

