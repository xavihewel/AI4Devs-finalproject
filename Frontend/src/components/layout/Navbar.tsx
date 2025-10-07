import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../auth/AuthProvider';
import { Button } from '../ui';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { authenticated, login, logout } = useAuth();
  
  const navItems = [
    { path: '/', label: 'Inicio' },
    { path: '/trips', label: 'Viajes', requiresAuth: true },
    { path: '/matches', label: 'Buscar', requiresAuth: true },
    { path: '/bookings', label: 'Reservas', requiresAuth: true },
  ];
  
  const isActivePath = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };
  
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link
              to="/"
              className="flex items-center text-xl font-bold text-primary-600"
            >
              🚗 Covoituraje
            </Link>
            
            <div className="hidden md:flex space-x-6">
              {navItems.map((item) => {
                if (item.requiresAuth && !authenticated) {
                  return null;
                }
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                      isActivePath(item.path)
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {authenticated ? (
              <>
                <Link
                  to="/me"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    isActivePath('/me')
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Mi Perfil
                </Link>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={logout}
                >
                  Cerrar Sesión
                </Button>
              </>
            ) : (
              <Button
                variant="primary"
                size="sm"
                onClick={login}
              >
                Iniciar Sesión
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
