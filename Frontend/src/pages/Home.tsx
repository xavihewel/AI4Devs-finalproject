import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import { Button, Card, CardContent } from '../components/ui';

export default function Home() {
  const { authenticated } = useAuth();
  
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
          🚗 <span className="text-primary-600">Covoituraje</span>
        </h1>
        <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          Comparte viajes corporativos y reduce costos de manera inteligente
        </p>
        
        {!authenticated ? (
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <Button variant="primary" size="lg" onClick={() => window.location.href = '/login'}>
              Comenzar Ahora
            </Button>
          </div>
        ) : (
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8 space-x-4">
            <Link to="/trips">
              <Button variant="primary" size="lg">
                Crear Viaje
              </Button>
            </Link>
            <Link to="/matches">
              <Button variant="secondary" size="lg">
                Buscar Viajes
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl mb-4">🚗</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Comparte tu Viaje</h3>
              <p className="text-gray-600">
                Ofrece asientos disponibles en tus viajes corporativos y ayuda a tus compañeros
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl mb-4">🔍</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Encuentra Matches</h3>
              <p className="text-gray-600">
                Nuestro algoritmo inteligente te encuentra los mejores viajes según tu ubicación y horario
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl mb-4">💰</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Ahorra Costos</h3>
              <p className="text-gray-600">
                Reduce gastos de transporte compartiendo viajes con compañeros de trabajo
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* How it works */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              ¿Cómo funciona?
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Tres simples pasos para comenzar a compartir viajes
            </p>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
              <div className="text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white text-xl font-bold mx-auto">
                  1
                </div>
                <h3 className="mt-6 text-lg font-medium text-gray-900">Crea tu Viaje</h3>
                <p className="mt-2 text-base text-gray-500">
                  Publica tu viaje corporativo con origen, destino y horario
                </p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white text-xl font-bold mx-auto">
                  2
                </div>
                <h3 className="mt-6 text-lg font-medium text-gray-900">Busca Matches</h3>
                <p className="mt-2 text-base text-gray-500">
                  Encuentra viajes compatibles con tu ubicación y horario
                </p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white text-xl font-bold mx-auto">
                  3
                </div>
                <h3 className="mt-6 text-lg font-medium text-gray-900">Reserva y Viaja</h3>
                <p className="mt-2 text-base text-gray-500">
                  Confirma tu reserva y disfruta del viaje compartido
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

