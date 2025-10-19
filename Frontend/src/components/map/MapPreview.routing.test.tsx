/**
 * Unit tests for MapPreview with routing functionality.
 * Tests route loading, display, error handling, and loading states.
 * Follows TDD: test first, then implement.
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import MapPreview from './MapPreview';
import { routingApiService, RouteResponse } from '../../api/routing';

// Mock the routing API service
jest.mock('../../api/routing', () => ({
  routingApiService: {
    getRoute: jest.fn(),
  },
}));

// Mock react-leaflet components
jest.mock('react-leaflet', () => ({
  MapContainer: ({ children }: { children: React.ReactNode }) => <div data-testid="map-container">{children}</div>,
  TileLayer: () => <div data-testid="tile-layer" />,
  CircleMarker: ({ center }: { center: [number, number] }) => (
    <div data-testid={`circle-marker-${center[0]}-${center[1]}`} />
  ),
  Polyline: ({ positions }: { positions: [number, number][] }) => (
    <div data-testid={`polyline-${positions.length}`} />
  ),
  useMap: () => ({
    fitBounds: jest.fn(),
    setView: jest.fn(),
  }),
}));

const mockGetRoute = routingApiService.getRoute as jest.MockedFunction<typeof routingApiService.getRoute>;

describe('MapPreview with Routing', () => {
  const mockOrigin = { lat: 41.3851, lng: 2.1734 };
  const mockDestination = { lat: 41.4036, lng: 2.1744 };
  const mockRoute: RouteResponse = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {
          distance: 5000,
          duration: 600,
        },
        geometry: {
          type: 'LineString',
          coordinates: [
            [41.3851, 2.1734],
            [41.3900, 2.1750],
            [41.4036, 2.1744],
          ],
        },
      },
    ],
  };

  beforeEach(() => {
    mockGetRoute.mockClear();
  });

  it('should render map with origin and destination markers', () => {
    render(
      <MapPreview
        origin={mockOrigin}
        destination={mockDestination}
        showRoute={false}
      />
    );

    expect(screen.getByTestId('map-container')).toBeInTheDocument();
    expect(screen.getByTestId('tile-layer')).toBeInTheDocument();
    expect(screen.getByTestId(`circle-marker-${mockOrigin.lat}-${mockOrigin.lng}`)).toBeInTheDocument();
    expect(screen.getByTestId(`circle-marker-${mockDestination.lat}-${mockDestination.lng}`)).toBeInTheDocument();
  });

  it('should load and display route when showRoute is true', async () => {
    mockGetRoute.mockResolvedValueOnce(mockRoute);

    render(
      <MapPreview
        origin={mockOrigin}
        destination={mockDestination}
        showRoute={true}
      />
    );

    // Should show loading state initially
    expect(screen.getByText('Cargando ruta...')).toBeInTheDocument();

    // Wait for route to load
    await waitFor(() => {
      expect(mockGetRoute).toHaveBeenCalledWith(mockOrigin, mockDestination);
    });

    // Should show route polyline
    await waitFor(() => {
      expect(screen.getByTestId('polyline-3')).toBeInTheDocument();
    });

    // Loading state should be gone
    expect(screen.queryByText('Cargando ruta...')).not.toBeInTheDocument();
  });

  it('should not load route when showRoute is false', () => {
    render(
      <MapPreview
        origin={mockOrigin}
        destination={mockDestination}
        showRoute={false}
      />
    );

    expect(mockGetRoute).not.toHaveBeenCalled();
    expect(screen.queryByTestId('polyline-3')).not.toBeInTheDocument();
  });

  it('should not load route when origin or destination is missing', () => {
    render(
      <MapPreview
        origin={mockOrigin}
        destination={null}
        showRoute={true}
      />
    );

    expect(mockGetRoute).not.toHaveBeenCalled();
  });

  it('should call onRouteLoaded when route is successfully loaded', async () => {
    const onRouteLoaded = jest.fn();
    mockGetRoute.mockResolvedValueOnce(mockRoute);

    render(
      <MapPreview
        origin={mockOrigin}
        destination={mockDestination}
        showRoute={true}
        onRouteLoaded={onRouteLoaded}
      />
    );

    await waitFor(() => {
      expect(onRouteLoaded).toHaveBeenCalledWith(mockRoute);
    });
  });

  it('should call onRouteError when route loading fails', async () => {
    const onRouteError = jest.fn();
    const error = new Error('API Error');
    mockGetRoute.mockRejectedValueOnce(error);

    render(
      <MapPreview
        origin={mockOrigin}
        destination={mockDestination}
        showRoute={true}
        onRouteError={onRouteError}
      />
    );

    await waitFor(() => {
      expect(onRouteError).toHaveBeenCalledWith(error);
    });
  });

  it('should handle route loading error gracefully', async () => {
    mockGetRoute.mockRejectedValueOnce(new Error('API Error'));

    render(
      <MapPreview
        origin={mockOrigin}
        destination={mockDestination}
        showRoute={true}
      />
    );

    // Should show loading state initially
    expect(screen.getByText('Cargando ruta...')).toBeInTheDocument();

    // Loading state should disappear after error
    await waitFor(() => {
      expect(screen.queryByText('Cargando ruta...')).not.toBeInTheDocument();
    });

    // Should not show polyline
    expect(screen.queryByTestId('polyline-3')).not.toBeInTheDocument();
  });

  it('should clear route when showRoute changes to false', async () => {
    mockGetRoute.mockResolvedValueOnce(mockRoute);

    const { rerender } = render(
      <MapPreview
        origin={mockOrigin}
        destination={mockDestination}
        showRoute={true}
      />
    );

    // Wait for route to load
    await waitFor(() => {
      expect(screen.getByTestId('polyline-3')).toBeInTheDocument();
    });

    // Change showRoute to false
    rerender(
      <MapPreview
        origin={mockOrigin}
        destination={mockDestination}
        showRoute={false}
      />
    );

    // Route should be cleared
    expect(screen.queryByTestId('polyline-3')).not.toBeInTheDocument();
  });

  it('should reload route when origin or destination changes', async () => {
    mockGetRoute.mockResolvedValue(mockRoute);

    const { rerender } = render(
      <MapPreview
        origin={mockOrigin}
        destination={mockDestination}
        showRoute={true}
      />
    );

    await waitFor(() => {
      expect(mockGetRoute).toHaveBeenCalledTimes(1);
    });

    // Change destination
    const newDestination = { lat: 41.5000, lng: 2.2000 };
    rerender(
      <MapPreview
        origin={mockOrigin}
        destination={newDestination}
        showRoute={true}
      />
    );

    await waitFor(() => {
      expect(mockGetRoute).toHaveBeenCalledTimes(2);
      expect(mockGetRoute).toHaveBeenLastCalledWith(mockOrigin, newDestination);
    });
  });

  it('should display fallback message when no coordinates are provided', () => {
    render(<MapPreview origin={null} destination={null} />);

    expect(screen.getByText('No hay coordenadas para mostrar el mapa.')).toBeInTheDocument();
  });

  it('should handle route with empty coordinates gracefully', async () => {
    const emptyRoute: RouteResponse = {
      type: 'FeatureCollection',
      features: [],
    };

    mockGetRoute.mockResolvedValueOnce(emptyRoute);

    render(
      <MapPreview
        origin={mockOrigin}
        destination={mockDestination}
        showRoute={true}
      />
    );

    await waitFor(() => {
      expect(mockGetRoute).toHaveBeenCalled();
    });

    // Should not show polyline for empty route
    expect(screen.queryByTestId('polyline-0')).not.toBeInTheDocument();
  });
});
