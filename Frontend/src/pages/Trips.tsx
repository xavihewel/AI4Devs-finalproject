import React, { useEffect, useState } from 'react';
import { api } from '../api/client';

type Trip = { id: string; origin: string; destination: string; driverId: string };

export default function Trips() {
  const [trips, setTrips] = useState<Trip[]>([]);
  useEffect(() => {
    api.get('/trips').then((r) => setTrips(r.data ?? []));
  }, []);
  return (
    <div style={{ padding: 24 }}>
      <h2>Mis trayectos</h2>
      <ul>
        {trips.map((t) => (
          <li key={t.id}>
            {t.origin} → {t.destination} (driver: {t.driverId})
          </li>
        ))}
      </ul>
    </div>
  );
}

