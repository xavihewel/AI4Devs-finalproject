import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import MapPreviewFixed from './MapPreview.fixed';
import { routingApiService, RouteResponse } from '../../api/routing';

// Mock the routing API service
jest.mock('../../api/routing', () => ({
  routingApiService: {
    getRoute: jest.fn(),
  },
}));

const mockGetRoute = routingApiService.getRoute as jest.MockedFunction<typeof routingApiService.getRoute>;

describe('MapPreviewFixed', () => {
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
      <MapPreviewFixed
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
      <MapPreviewFixed
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
      <MapPreviewFixed
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
      <MapPreviewFixed
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
      <MapPreviewFixed
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
      <MapPreviewFixed
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

  it('should display fallback message when no coordinates are provided', () => {
    render(<MapPreviewFixed origin={null} destination={null} />);

    expect(screen.getByText('No hay coordenadas para mostrar el mapa.')).toBeInTheDocument();
  });
});
