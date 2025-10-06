import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import Home from './Home';
import { AuthProvider } from '../auth/AuthProvider';

vi.mock('../auth/keycloak', () => {
  return {
    getKeycloak: () => ({
      token: undefined,
      init: vi.fn().mockResolvedValue(false),
      login: vi.fn(),
      logout: vi.fn(),
      updateToken: vi.fn().mockResolvedValue(false),
    }),
  };
});

describe('Home', () => {
  it('renders welcome title', () => {
    render(
      <AuthProvider>
        <Home />
      </AuthProvider>
    );
    expect(screen.getByText(/Bienvenido a Covoituraje/i)).toBeInTheDocument();
  });
});

