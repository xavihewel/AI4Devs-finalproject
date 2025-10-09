import React, { useEffect, useState } from 'react';
import { BookingsService } from '../api/bookings';
import type { BookingDto } from '../types/api';
import { Button, Card, CardContent, CardHeader, CardTitle, LoadingSpinner } from '../components/ui';

export default function Bookings() {
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<BookingDto[]>([]);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const data = await BookingsService.getMyBookings();
      setBookings(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading bookings:', error);
      showMessage('error', 'Error al cargar las reservas');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id: string) => {
    if (!window.confirm('¿Estás seguro de que quieres cancelar esta reserva?')) {
      return;
    }
    
    try {
      setActionInProgress(id);
      await BookingsService.cancelBooking(id);
      await loadBookings();
      showMessage('success', 'Reserva cancelada exitosamente');
    } catch (error) {
      console.error('Error cancelling booking:', error);
      showMessage('error', 'Error al cancelar la reserva');
    } finally {
      setActionInProgress(null);
    }
  };

  const getStatusBadge = (status: BookingDto['status']) => {
    const styles = {
      CONFIRMED: 'bg-green-100 text-green-800 border-green-200',
      PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      CANCELLED: 'bg-red-100 text-red-800 border-red-200',
    };
    
    const labels = {
      CONFIRMED: 'Confirmada',
      PENDING: 'Pendiente',
      CANCELLED: 'Cancelada',
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Mis Reservas</h1>
      </div>

      {message && (
        <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
          <p className="font-medium">{message.text}</p>
        </div>
      )}

      {bookings.length === 0 ? (
        <Card>
          <CardContent>
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tienes reservas</h3>
              <p className="text-gray-500 mb-4">
                Cuando reserves un viaje, aparecerá aquí.
              </p>
              <p className="text-sm text-gray-400">
                Ve a "Buscar" para encontrar viajes disponibles
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {bookings.map((booking) => (
            <Card key={booking.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>Reserva #{booking.id.substring(0, 8)}</CardTitle>
                  {getStatusBadge(booking.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">ID del Viaje</p>
                      <p className="font-medium text-gray-900">{booking.tripId}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Asientos reservados</p>
                      <p className="font-medium text-gray-900">{booking.seatsRequested}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Fecha de reserva</p>
                      <p className="font-medium text-gray-900">
                        {new Date(booking.createdAt || Date.now()).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Estado</p>
                      <p className="font-medium text-gray-900">
                        {booking.status === 'CONFIRMED' && 'Confirmada'}
                        {booking.status === 'PENDING' && 'Pendiente de confirmación'}
                        {booking.status === 'CANCELLED' && 'Cancelada'}
                      </p>
                    </div>
                  </div>

                  {booking.status !== 'CANCELLED' && (
                    <div className="pt-4 border-t border-gray-200">
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleCancel(booking.id)}
                        disabled={actionInProgress === booking.id}
                        loading={actionInProgress === booking.id}
                      >
                        Cancelar Reserva
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

