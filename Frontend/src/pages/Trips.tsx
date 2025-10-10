import React, { useEffect, useState } from 'react';
import { TripsService } from '../api';
import type { TripDto, TripCreateDto } from '../types/api';
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Select, LoadingSpinner } from '../components/ui';
import MapPreview from '../components/map/MapPreview';
import { env } from '../env';

interface FormErrors {
  lat?: string;
  lng?: string;
  destinationSedeId?: string;
  dateTime?: string;
  seatsTotal?: string;
}

export default function Trips() {
  const [trips, setTrips] = useState<TripDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

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

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const validateForm = (): FormErrors => {
    const errors: FormErrors = {};

    // Validar latitud
    if (formData.origin.lat === 0 && !touched.lat) {
      errors.lat = 'La latitud es obligatoria';
    } else if (formData.origin.lat < -90 || formData.origin.lat > 90) {
      errors.lat = 'La latitud debe estar entre -90 y 90';
    }

    // Validar longitud
    if (formData.origin.lng === 0 && !touched.lng) {
      errors.lng = 'La longitud es obligatoria';
    } else if (formData.origin.lng < -180 || formData.origin.lng > 180) {
      errors.lng = 'La longitud debe estar entre -180 y 180';
    }

    // Validar destino
    if (!formData.destinationSedeId || formData.destinationSedeId === '') {
      errors.destinationSedeId = 'El destino es obligatorio';
    }

    // Validar fecha y hora
    if (!formData.dateTime) {
      errors.dateTime = 'La fecha y hora son obligatorias';
    } else {
      const selectedDate = new Date(formData.dateTime);
      const now = new Date();
      if (selectedDate <= now) {
        errors.dateTime = 'La fecha debe ser en el futuro';
      }
    }

    // Validar asientos
    if (!formData.seatsTotal || formData.seatsTotal < 1) {
      errors.seatsTotal = 'Debe haber al menos 1 asiento';
    } else if (formData.seatsTotal > 8) {
      errors.seatsTotal = 'No pueden ser más de 8 asientos';
    }

    return errors;
  };

  const handleFieldBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const errors = validateForm();
    setFormErrors(errors);
  };

  const loadTrips = async () => {
    try {
      setLoading(true);
      const data = await TripsService.getAllTrips();
      setTrips(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading trips:', error);
      showMessage('error', 'Error al cargar los viajes');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Marcar todos los campos como "touched" para mostrar errores
    setTouched({
      lat: true,
      lng: true,
      destinationSedeId: true,
      dateTime: true,
      seatsTotal: true,
    });

    // Validar formulario
    const errors = validateForm();
    setFormErrors(errors);

    // Si hay errores, no enviar
    if (Object.keys(errors).length > 0) {
      showMessage('error', 'Por favor corrige los errores en el formulario');
      return;
    }

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
      setFormErrors({});
      setTouched({});
      await loadTrips();
      showMessage('success', '¡Viaje creado exitosamente!');
    } catch (error) {
      console.error('Error creating trip:', error);
      showMessage('error', 'Error al crear el viaje');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (tripId: string) => {
    if (!window.confirm('¿Estás seguro de que quieres cancelar este viaje?')) {
      return;
    }
    try {
      setActionInProgress(tripId);
      await TripsService.deleteTrip(tripId);
      await loadTrips();
      showMessage('success', 'Viaje cancelado exitosamente');
    } catch (error) {
      console.error('Error deleting trip:', error);
      showMessage('error', 'Error al cancelar el viaje');
    } finally {
      setActionInProgress(null);
    }
  };

  const handleIncreaseSeats = async (trip: TripDto) => {
    try {
      setActionInProgress(trip.id);
      await TripsService.updateTrip(trip.id, { seatsTotal: trip.seatsTotal + 1 });
      await loadTrips();
      showMessage('success', `Asientos actualizados: ${trip.seatsTotal + 1} total, ${trip.seatsFree + 1} libres`);
    } catch (error) {
      console.error('Error updating trip:', error);
      showMessage('error', 'Error al actualizar el viaje');
    } finally {
      setActionInProgress(null);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Si el campo ya fue tocado, revalidar inmediatamente
    if (touched[field]) {
      setTimeout(() => {
        const errors = validateForm();
        setFormErrors(errors);
      }, 0);
    }
  };

  const sedeOptions = [
    { value: '', label: 'Selecciona un destino' },
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

      {message && (
        <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
          <p className="font-medium">{message.text}</p>
        </div>
      )}

      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Crear Nuevo Viaje</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Latitud de Origen *"
                  type="number"
                  step="any"
                  value={formData.origin.lat}
                  onChange={(e) => {
                    const val = e.target.value === '' ? 0 : parseFloat(e.target.value);
                    handleInputChange('origin', { ...formData.origin, lat: isNaN(val) ? 0 : val });
                  }}
                  onBlur={() => handleFieldBlur('lat')}
                  placeholder="40.4168"
                  error={touched.lat ? formErrors.lat : undefined}
                  required
                />
                <Input
                  label="Longitud de Origen *"
                  type="number"
                  step="any"
                  value={formData.origin.lng}
                  onChange={(e) => {
                    const val = e.target.value === '' ? 0 : parseFloat(e.target.value);
                    handleInputChange('origin', { ...formData.origin, lng: isNaN(val) ? 0 : val });
                  }}
                  onBlur={() => handleFieldBlur('lng')}
                  placeholder="-3.7038"
                  error={touched.lng ? formErrors.lng : undefined}
                  required
                />
              </div>

              <Select
                label="Destino *"
                value={formData.destinationSedeId}
                onChange={(e) => handleInputChange('destinationSedeId', e.target.value)}
                onBlur={() => handleFieldBlur('destinationSedeId')}
                options={sedeOptions}
                error={touched.destinationSedeId ? formErrors.destinationSedeId : undefined}
                required
              />

              <Input
                label="Fecha y Hora *"
                type="datetime-local"
                value={formData.dateTime}
                onChange={(e) => handleInputChange('dateTime', e.target.value)}
                onBlur={() => handleFieldBlur('dateTime')}
                error={touched.dateTime ? formErrors.dateTime : undefined}
                required
              />

              <Input
                label="Asientos Totales *"
                type="number"
                min="1"
                max="8"
                value={formData.seatsTotal}
                onChange={(e) => {
                  const val = e.target.value === '' ? 1 : parseInt(e.target.value, 10);
                  handleInputChange('seatsTotal', isNaN(val) ? 1 : val);
                }}
                onBlur={() => handleFieldBlur('seatsTotal')}
                error={touched.seatsTotal ? formErrors.seatsTotal : undefined}
                helperText="Máximo 8 asientos"
                required
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
                  <p><strong>Asientos:</strong> {(trip?.seatsFree ?? 0)} libres de {(trip?.seatsTotal ?? 0)} total</p>
                </div>

                {typeof trip?.origin?.lat === 'number' && typeof trip?.origin?.lng === 'number' && (
                  <div className="pt-2">
                    <MapPreview
                      origin={{ lat: trip.origin.lat, lng: trip.origin.lng }}
                      height={180}
                      interactive={false}
                      tilesUrl={env.mapTilesUrl}
                    />
                  </div>
                )}

                <div className="flex space-x-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    data-cy={`edit-trip-${trip.id}`}
                    onClick={() => handleIncreaseSeats(trip)}
                    disabled={actionInProgress === trip.id}
                    loading={actionInProgress === trip.id}
                  >
                    +1 Asiento
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    data-cy={`delete-trip-${trip.id}`}
                    onClick={() => handleDelete(trip.id)}
                    disabled={actionInProgress === trip.id}
                    loading={actionInProgress === trip.id}
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

