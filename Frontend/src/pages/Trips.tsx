import React, { useEffect, useState } from 'react';
import { TripsService } from '../api';
import type { TripDto, TripCreateDto } from '../types/api';
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Select, LoadingSpinner } from '../components/ui';

export default function Trips() {
  const [trips, setTrips] = useState<TripDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [creating, setCreating] = useState(false);

  // Form state
  const [formData, setFormData] = useState<TripCreateDto>({
    origin: { lat: 0, lng: 0 },
    destinationSedeId: '',
    dateTime: '',
    seatsTotal: 1,
  });

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    try {
      setLoading(true);
      const data = await TripsService.getAllTrips();
      setTrips(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading trips:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setCreating(true);
      const payload: TripCreateDto = {
        ...formData,
        dateTime: new Date(formData.dateTime).toISOString(),
      };
      await TripsService.createTrip(payload);
      setShowCreateForm(false);
      setFormData({
        origin: { lat: 0, lng: 0 },
        destinationSedeId: '',
        dateTime: '',
        seatsTotal: 1,
      });
      await loadTrips();
    } catch (error) {
      console.error('Error creating trip:', error);
    } finally {
      setCreating(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const sedeOptions = [
    { value: 'SEDE-1', label: 'Sede Madrid Centro' },
    { value: 'SEDE-2', label: 'Sede Madrid Norte' },
    { value: 'SEDE-3', label: 'Sede Barcelona' },
  ];

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
        <h1 className="text-3xl font-bold text-gray-900">Mis Viajes</h1>
        <Button
          variant="primary"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          {showCreateForm ? 'Cancelar' : 'Crear Viaje'}
        </Button>
      </div>

      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Crear Nuevo Viaje</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Latitud de Origen"
                  type="number"
                  step="any"
                  value={formData.origin.lat}
                  onChange={(e) => handleInputChange('origin', { ...formData.origin, lat: parseFloat(e.target.value) })}
                  placeholder="40.4168"
                />
                <Input
                  label="Longitud de Origen"
                  type="number"
                  step="any"
                  value={formData.origin.lng}
                  onChange={(e) => handleInputChange('origin', { ...formData.origin, lng: parseFloat(e.target.value) })}
                  placeholder="-3.7038"
                />
              </div>

              <Select
                label="Destino"
                value={formData.destinationSedeId}
                onChange={(e) => handleInputChange('destinationSedeId', e.target.value)}
                options={sedeOptions}
              />

              <Input
                label="Fecha y Hora"
                type="datetime-local"
                value={formData.dateTime}
                onChange={(e) => handleInputChange('dateTime', e.target.value)}
              />

              <Input
                label="Asientos Totales"
                type="number"
                min="1"
                value={formData.seatsTotal}
                onChange={(e) => handleInputChange('seatsTotal', parseInt(e.target.value))}
              />

              <div className="flex space-x-4">
                <Button
                  type="submit"
                  variant="primary"
                  loading={creating}
                  disabled={creating}
                >
                  Crear Viaje
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowCreateForm(false)}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(trips ?? []).map((trip) => (
          <Card key={trip.id}>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-lg">Viaje a {trip.destinationSedeId}</h3>
                  <span className="text-sm text-gray-500">
                    {(() => {
                      const d = trip?.dateTime ? new Date(trip.dateTime) : new Date(0);
                      return isNaN(d.getTime()) ? '' : d.toLocaleDateString();
                    })()}
                  </span>
                </div>
                
                <div className="space-y-2 text-sm text-gray-600">
                  {(() => {
                    const lat = typeof trip?.origin?.lat === 'number' ? trip.origin.lat : 0;
                    const lng = typeof trip?.origin?.lng === 'number' ? trip.origin.lng : 0;
                    return (
                      <p><strong>Origen:</strong> {lat.toFixed(4)}, {lng.toFixed(4)}</p>
                    );
                  })()}
                  <p><strong>Destino:</strong> {trip.destinationSedeId}</p>
                  <p><strong>Hora:</strong> {(() => {
                    const d = trip?.dateTime ? new Date(trip.dateTime) : new Date(0);
                    return isNaN(d.getTime()) ? '' : d.toLocaleTimeString();
                  })()}</p>
                  <p><strong>Asientos:</strong> {(trip?.seatsFree ?? 0)} / {(trip?.seatsTotal ?? 0)} disponibles</p>
                </div>

                <div className="flex space-x-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    data-cy={`edit-trip-${trip.id}`}
                    onClick={async () => {
                      try {
                        await TripsService.updateTrip(trip.id, { seatsTotal: trip.seatsTotal + 1 });
                        await loadTrips();
                      } catch (e) {
                        console.error('Error updating trip:', e);
                      }
                    }}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    data-cy={`delete-trip-${trip.id}`}
                    onClick={async () => {
                      try {
                        await TripsService.deleteTrip(trip.id);
                        await loadTrips();
                      } catch (e) {
                        console.error('Error deleting trip:', e);
                      }
                    }}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {trips.length === 0 && (
        <Card>
          <CardContent>
            <div className="text-center py-8">
              <div className="text-4xl mb-4">🚗</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tienes viajes creados</h3>
              <p className="text-gray-500 mb-4">
                Crea tu primer viaje para comenzar a compartir con tus compañeros
              </p>
              <Button variant="primary" onClick={() => setShowCreateForm(true)}>
                Crear mi primer viaje
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

