import React, { useEffect, useState } from 'react';
import { api } from '../api/client';

type Booking = { id: string; tripId: string; passengerId: string };

export default function Bookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  useEffect(() => {
    api.get('/bookings').then((r) => setBookings(r.data ?? []));
  }, []);
  return (
    <div style={{ padding: 24 }}>
      <h2>Mis reservas</h2>
      <ul>
        {bookings.map((b) => (
          <li key={b.id}>
            {b.id} → trip {b.tripId} (passenger: {b.passengerId})
          </li>
        ))}
      </ul>
    </div>
  );
}

