import React, { useEffect, useState } from 'react';
import { api } from '../api/client';

type Me = { id: string; name?: string; email?: string };

export default function Profile() {
  const [me, setMe] = useState<Me | null>(null);
  useEffect(() => {
    api.get('/users/me').then((r) => setMe(r.data ?? null));
  }, []);
  return (
    <div style={{ padding: 24 }}>
      <h2>Mi Perfil</h2>
      <pre>{JSON.stringify(me, null, 2)}</pre>
    </div>
  );
}

