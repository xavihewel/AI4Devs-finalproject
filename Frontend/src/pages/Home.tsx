import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import { Button, Card, CardContent } from '../components/ui';

export default function Home() {
  const { authenticated, login } = useAuth();
  
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <img 
            src="/logo.png" 
            alt="Logo" 
            className="h-20 w-auto"
          />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
          <span className="text-primary-600">bonÀreaGo</span>
        </h1>
        <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          Tu plataforma corporativa para compartir viajes. Reduce costos y contribuye a la sostenibilidad.
        </p>
        
        {!authenticated ? (
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <Button variant="primary" size="lg" onClick={login}>
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
              <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-primary-100 mb-4">
                <svg className="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
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
              <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-green-100 mb-4">
                <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
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
              <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-blue-100 mb-4">
                <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
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

