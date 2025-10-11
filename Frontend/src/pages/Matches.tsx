import React, { useEffect, useState } from 'react';
import { MatchesService, BookingsService } from '../api';
import type { MatchDto } from '../types/api';
import { Button, Card, CardContent, Input, Select, LoadingSpinner } from '../components/ui';
import MapPreview from '../components/map/MapPreview';
import { TrustProfile } from '../components/trust/TrustProfile';
import { RatingForm } from '../components/trust/RatingForm';
import { env } from '../env';

export default function Matches() {
  const [matches, setMatches] = useState<MatchDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [bookingInProgress, setBookingInProgress] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [bookedTrips, setBookedTrips] = useState<Set<string>>(new Set());
  const [loadingBookings, setLoadingBookings] = useState(true);
  
  // Trust system state
  const [showTrustProfile, setShowTrustProfile] = useState<string | null>(null);
  const [showRatingForm, setShowRatingForm] = useState<string | null>(null);

  // Search form state
  const [searchParams, setSearchParams] = useState({
    destinationSedeId: '',
    time: '',
    origin: '',
  });

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  // Cargar reservas existentes al montar el componente
  useEffect(() => {
    loadExistingBookings();
  }, []);

  const loadExistingBookings = async () => {
    try {
      setLoadingBookings(true);
      const bookings = await BookingsService.getMyBookings();
      // Extraer los tripIds de las reservas activas (no canceladas)
      const tripIds = bookings
        .filter(booking => booking.status !== 'CANCELLED')
        .map(booking => booking.tripId);
      setBookedTrips(new Set(tripIds));
    } catch (error) {
      console.error('Error loading bookings:', error);
      // No mostrar error al usuario, simplemente no marcar viajes
    } finally {
      setLoadingBookings(false);
    }
  };

  const sedeOptions = [
    { value: '', label: 'Seleccionar destino...' },
    { value: 'SEDE-1', label: 'Sede Madrid Centro' },
    { value: 'SEDE-2', label: 'Sede Madrid Norte' },
    { value: 'SEDE-3', label: 'Sede Barcelona' },
  ];

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchParams.destinationSedeId) {
      alert('Por favor selecciona un destino');
      return;
    }

    try {
      setSearching(true);
      const data = await MatchesService.findMatches(searchParams);
      setMatches(data);
    } catch (error) {
      console.error('Error searching matches:', error);
      alert('Error al buscar matches. Intenta nuevamente.');
    } finally {
      setSearching(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setSearchParams(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBooking = async (match: MatchDto) => {
    const seatsToBook = prompt(`¿Cuántos asientos deseas reservar? (Disponibles: ${match.seatsFree})`);
    
    if (!seatsToBook) return; // Usuario canceló
    
    const seats = parseInt(seatsToBook, 10);
    
    if (isNaN(seats) || seats < 1) {
      showMessage('error', 'Por favor ingresa un número válido de asientos');
      return;
    }
    
    if (seats > match.seatsFree) {
      showMessage('error', `Solo hay ${match.seatsFree} asientos disponibles`);
      return;
    }
    
    try {
      setBookingInProgress(match.tripId);
      await BookingsService.createBooking({
        tripId: match.tripId,
        seatsRequested: seats
      });
      
      // Marcar el viaje como reservado
      setBookedTrips(prev => new Set(prev).add(match.tripId));
      
      showMessage('success', `¡Reserva creada exitosamente! ${seats} asiento(s) reservado(s). Ve a "Reservas" para ver tu reserva.`);
      
      // Recargar búsqueda para actualizar asientos disponibles
      await handleSearch({ preventDefault: () => {} } as React.FormEvent);
    } catch (error: any) {
      console.error('Error creating booking:', error);
      const errorMsg = error?.response?.data?.message || error?.message || 'Error al crear la reserva';
      showMessage('error', errorMsg);
    } finally {
      setBookingInProgress(null);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600 bg-green-100';
    if (score >= 0.6) return 'text-yellow-600 bg-yellow-100';
    if (score >= 0.4) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 0.8) return 'Excelente';
    if (score >= 0.6) return 'Bueno';
    if (score >= 0.4) return 'Regular';
    return 'Bajo';
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Buscar Viajes</h1>

      {message && (
        <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
          <p className="font-medium">{message.text}</p>
        </div>
      )}

      {/* Search Form */}
      <Card>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select
                label="Destino"
                value={searchParams.destinationSedeId}
                onChange={(e) => handleInputChange('destinationSedeId', e.target.value)}
                options={sedeOptions}
              />

              <Input
                label="Hora Preferida (HH:MM)"
                type="time"
                value={searchParams.time}
                onChange={(e) => handleInputChange('time', e.target.value)}
                placeholder="08:30"
              />

              <Input
                label="Ubicación de Origen (lat,lng)"
                type="text"
                value={searchParams.origin}
                onChange={(e) => handleInputChange('origin', e.target.value)}
                placeholder="40.4168,-3.7038"
                helperText="Formato: latitud,longitud"
              />
            </div>

            <div className="flex justify-center">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={searching}
                disabled={searching || !searchParams.destinationSedeId}
              >
                {searching ? 'Buscando...' : 'Buscar Viajes'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center h-32">
          <LoadingSpinner size="lg" />
        </div>
      )}

      {/* Results */}
      {matches.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Encontrados {matches.length} viajes compatibles
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.map((match) => (
              <Card key={match.id}>
                <CardContent>
                  <div className="space-y-4">
                    {/* Score Badge and Booked Status */}
                    <div className="flex justify-between items-start">
                      <div className="flex items-center flex-wrap gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(match.score)}`}>
                          {getScoreLabel(match.score)} ({Math.round(match.score * 100)}%)
                        </span>
                        {bookedTrips.has(match.tripId) && (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200 flex items-center gap-1">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Ya reservado
                          </span>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">
                          {new Date(match.dateTime).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(match.dateTime).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>

                    {/* Trip Details */}
                    <div className="space-y-2">
                      <h3 className="font-semibold text-lg">
                        Viaje a {match.destinationSedeId}
                      </h3>
                      
                      <div className="space-y-1 text-sm text-gray-600">
                        <p><strong>Origen:</strong> {match.origin}</p>
                        <p><strong>Asientos libres:</strong> {match.seatsFree}</p>
                      </div>

                      {(() => {
                        // match.origin viene como string "lat,lng"; lo parseamos
                        const parts = (match.origin || '').split(',').map(s => parseFloat(s.trim()));
                        const hasCoords = parts.length === 2 && parts.every(n => !isNaN(n));
                        if (!hasCoords) return null;
                        const [lat, lng] = parts as [number, number];
                        return (
                          <div className="pt-2">
                            <MapPreview
                              origin={{ lat, lng }}
                              height={160}
                              interactive={false}
                              tilesUrl={env.mapTilesUrl}
                            />
                          </div>
                        );
                      })()}

                      {/* Match Reasons */}
                      {match.reasons && match.reasons.length > 0 && (
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-gray-700">Razones de compatibilidad:</p>
                          <ul className="text-xs text-gray-600 space-y-1">
                            {match.reasons.map((reason, index) => (
                              <li key={`${match.id}-reason-${index}`} className="flex items-center">
                                <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mr-2"></span>
                                {reason}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Action Button */}
                    <div className="pt-4 border-t border-gray-200">
                      <Button
                        variant="primary"
                        className="w-full"
                        onClick={() => handleBooking(match)}
                        disabled={bookingInProgress === match.tripId || match.seatsFree === 0 || bookedTrips.has(match.tripId)}
                        loading={bookingInProgress === match.tripId}
                      >
                        {match.seatsFree === 0
                          ? 'Sin asientos disponibles'
                          : bookedTrips.has(match.tripId)
                            ? 'Ya reservado'
                            : 'Reservar Viaje'}
                      </Button>
                      
                      {/* Trust System Buttons */}
                      <div className="flex space-x-2 mt-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          className="flex-1"
                          onClick={() => setShowTrustProfile(match.driverId)}
                        >
                          👤 Ver Perfil
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          className="flex-1"
                          onClick={() => setShowRatingForm(match.driverId)}
                        >
                          ⭐ Valorar
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {!loading && matches.length === 0 && searchParams.destinationSedeId && (
        <Card>
          <CardContent>
            <div className="text-center py-8">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron viajes</h3>
              <p className="text-gray-500 mb-4">
                No hay viajes disponibles que coincidan con tus criterios de búsqueda.
              </p>
              <Button
                variant="secondary"
                onClick={() => {
                  setSearchParams({ destinationSedeId: '', time: '', origin: '' });
                  setMatches([]);
                }}
              >
                Limpiar Búsqueda
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Initial State */}
      {!loading && matches.length === 0 && !searchParams.destinationSedeId && (
        <Card>
          <CardContent>
            <div className="text-center py-8">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Busca tu viaje ideal</h3>
              <p className="text-gray-500">
                Completa el formulario de búsqueda para encontrar viajes compatibles con tu ubicación y horario.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Trust Profile Modal */}
      {showTrustProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[9999] modal-overlay">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Perfil de Confianza</h2>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowTrustProfile(null)}
                >
                  ✕
                </Button>
              </div>
              <TrustProfile userId={showTrustProfile} />
            </div>
          </div>
        </div>
      )}

      {/* Rating Form Modal */}
      {showRatingForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[9999] modal-overlay">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Valorar Usuario</h2>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowRatingForm(null)}
                >
                  ✕
                </Button>
              </div>
              <RatingForm
                ratedUserId={showRatingForm}
                onSuccess={() => {
                  setShowRatingForm(null);
                  showMessage('success', 'Valoración enviada correctamente');
                }}
                onCancel={() => setShowRatingForm(null)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

