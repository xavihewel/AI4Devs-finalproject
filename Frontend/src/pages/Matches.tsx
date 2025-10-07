import React, { useState } from 'react';
import { MatchesService } from '../api';
import type { MatchDto } from '../types/api';
import { Button, Card, CardContent, Input, Select, LoadingSpinner } from '../components/ui';

export default function Matches() {
  const [matches, setMatches] = useState<MatchDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);

  // Search form state
  const [searchParams, setSearchParams] = useState({
    destinationSedeId: '',
    time: '',
    origin: '',
  });

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
                    {/* Score Badge */}
                    <div className="flex justify-between items-start">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(match.score)}`}>
                          {getScoreLabel(match.score)} ({Math.round(match.score * 100)}%)
                        </span>
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
                        <p><strong>Asientos disponibles:</strong> {match.seatsFree}</p>
                      </div>

                      {/* Match Reasons */}
                      {match.reasons && match.reasons.length > 0 && (
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-gray-700">Razones de compatibilidad:</p>
                          <ul className="text-xs text-gray-600 space-y-1">
                            {match.reasons.map((reason, index) => (
                              <li key={index} className="flex items-center">
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
                        onClick={() => {
                          // TODO: Implement booking functionality
                          alert(`Reservar viaje ${match.tripId}`);
                        }}
                      >
                        Reservar Viaje
                      </Button>
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
    </div>
  );
}

