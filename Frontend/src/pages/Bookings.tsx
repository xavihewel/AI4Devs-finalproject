import React, { useEffect, useMemo, useState } from 'react';
import { BookingsService } from '../api/bookings';
import type { BookingDto, BookingCreateDto } from '../types/api';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

type UiState = 'idle' | 'loading' | 'error';

export default function Bookings() {
  const [state, setState] = useState<UiState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [bookings, setBookings] = useState<BookingDto[]>([]);
  const [creating, setCreating] = useState<boolean>(false);
  const [tripId, setTripId] = useState<string>('');
  const [seatsRequested, setSeatsRequested] = useState<number>(1);

  const canCreate = useMemo(() => tripId.trim().length > 0 && seatsRequested > 0, [tripId, seatsRequested]);

  useEffect(() => {
    setState('loading');
    BookingsService.getMyBookings()
      .then(setBookings)
      .catch((e) => setError(String(e?.message ?? e)))
      .finally(() => setState('idle'));
  }, []);

  const onCreate = async () => {
    if (!canCreate) return;
    setCreating(true);
    setError(null);
    const payload: BookingCreateDto = { tripId, seatsRequested };
    try {
      const created = await BookingsService.createBooking(payload);
      setBookings((prev) => [created, ...prev]);
      setTripId('');
      setSeatsRequested(1);
    } catch (e: any) {
      setError(String(e?.message ?? e));
    } finally {
      setCreating(false);
    }
  };

  const onCancel = async (id: string) => {
    setState('loading');
    setError(null);
    try {
      const updated = await BookingsService.cancelBooking(id);
      setBookings((prev) => prev.map((b) => (b.id === id ? updated : b)));
    } catch (e: any) {
      setError(String(e?.message ?? e));
    } finally {
      setState('idle');
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Mis reservas</h2>

      <div style={{ marginTop: 16, marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input
            aria-label="Trip ID"
            placeholder="Trip ID"
            value={tripId}
            onChange={(e) => setTripId(e.target.value)}
          />
          <input
            aria-label="Seats"
            type="number"
            min={1}
            value={seatsRequested}
            onChange={(e) => setSeatsRequested(parseInt(e.target.value || '1', 10))}
          />
          <Button onClick={onCreate} disabled={!canCreate || creating}>
            {creating ? 'Creando…' : 'Crear reserva'}
          </Button>
        </div>
      </div>

      {state === 'loading' && (
        <div style={{ padding: 12 }}>
          <LoadingSpinner />
        </div>
      )}
      {error && (
        <div role="alert" style={{ color: 'red', marginBottom: 12 }}>
          {error}
        </div>
      )}
      {bookings.length === 0 && state === 'idle' && !error && <div>No tienes reservas.</div>}
      {bookings.length > 0 && (
        <ul style={{ marginTop: 8 }}>
          {bookings.map((b) => (
            <li key={b.id} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span>
                <strong>#{b.id}</strong> trip {b.tripId} · seats {b.seatsRequested} · status{' '}
                <Badge status={b.status} />
              </span>
              {b.status !== 'CANCELLED' && (
                <Button onClick={() => onCancel(b.id)} variant="secondary">
                  Cancelar
                </Button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Badge({ status }: { status: BookingDto['status'] }) {
  const color =
    status === 'CONFIRMED' ? '#16a34a' : status === 'PENDING' ? '#f59e0b' : status === 'CANCELLED' ? '#ef4444' : '#6b7280';
  return (
    <span style={{ color, fontWeight: 600 }} aria-label={`status-${status.toLowerCase()}`}>
      {status}
    </span>
  );
}

