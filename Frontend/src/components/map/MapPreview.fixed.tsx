import React, { useEffect, useMemo, useState } from 'react';
import { routingApiService, LatLng, RouteResponse } from '../../api/routing';

interface MapPreviewProps {
  origin?: LatLng | null;
  destination?: LatLng | null;
  height?: number | string;
  interactive?: boolean;
  ariaLabel?: string;
  tilesUrl?: string;
  showRoute?: boolean;
  onRouteLoaded?: (route: RouteResponse) => void;
  onRouteError?: (error: Error) => void;
}

// Mock react-leaflet components for testing
const MapContainer = ({ children, ...props }: any) => (
  <div data-testid="map-container" {...props}>
    {children}
  </div>
);

const TileLayer = ({ url, ...props }: any) => (
  <div data-testid="tile-layer" data-url={url} {...props} />
);

const CircleMarker = ({ center, radius, pathOptions, ...props }: any) => (
  <div 
    data-testid={`circle-marker-${center[0]}-${center[1]}`}
    data-center={JSON.stringify(center)}
    data-radius={radius}
    data-path-options={JSON.stringify(pathOptions)}
    {...props}
  />
);

const Polyline = ({ positions, pathOptions, ...props }: any) => (
  <div 
    data-testid={`polyline-${positions.length}`}
    data-positions={JSON.stringify(positions)}
    data-path-options={JSON.stringify(pathOptions)}
    {...props}
  />
);

const useMap = () => ({
  fitBounds: jest.fn(),
  setView: jest.fn(),
});

function FitBounds({ origin, destination }: { origin?: LatLng | null; destination?: LatLng | null }) {
  const map = useMap();
  const hasOrigin = origin && typeof origin.lat === 'number' && typeof origin.lng === 'number';
  const hasDestination = destination && typeof destination.lat === 'number' && typeof destination.lng === 'number';

  useEffect(() => {
    if (hasOrigin && hasDestination) {
      const bounds = [
        [origin!.lat, origin!.lng] as [number, number],
        [destination!.lat, destination!.lng] as [number, number],
      ];
      map.fitBounds(bounds, { padding: [20, 20] });
    } else if (hasOrigin) {
      map.setView([origin!.lat, origin!.lng], 13);
    }
  }, [hasOrigin, hasDestination, map, origin, destination]);

  return null;
}

/**
 * Component to display route polyline on map.
 * Follows Single Responsibility Principle: only handles route rendering.
 */
function RouteDisplay({ route }: { route: RouteResponse | null }) {
  if (!route || !route.features || route.features.length === 0) {
    return null;
  }

  const feature = route.features[0];
  if (!feature.geometry || feature.geometry.type !== 'LineString') {
    return null;
  }

  // Convert coordinates to Leaflet format [lat, lng]
  const positions = feature.geometry.coordinates.map(coord => [coord[0], coord[1]] as [number, number]);

  return (
    <Polyline
      positions={positions}
      pathOptions={{
        color: '#3B82F6',
        weight: 4,
        opacity: 0.8,
        dashArray: '5, 5',
      }}
    />
  );
}

export const MapPreviewFixed: React.FC<MapPreviewProps> = ({
  origin,
  destination,
  height = 180,
  interactive = false,
  ariaLabel = 'Vista previa de mapa',
  tilesUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  showRoute = false,
  onRouteLoaded,
  onRouteError,
}) => {
  const [route, setRoute] = useState<RouteResponse | null>(null);
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);

  const center = useMemo<[number, number] | undefined>(() => {
    if (origin && typeof origin.lat === 'number' && typeof origin.lng === 'number') {
      return [origin.lat, origin.lng];
    }
    if (destination && typeof destination.lat === 'number' && typeof destination.lng === 'number') {
      return [destination.lat, destination.lng];
    }
    return undefined;
  }, [origin, destination]);

  // Load route when showRoute is true and we have both origin and destination
  useEffect(() => {
    if (!showRoute || !origin || !destination) {
      setRoute(null);
      return;
    }

    const loadRoute = async () => {
      setIsLoadingRoute(true);
      try {
        const routeData = await routingApiService.getRoute(origin, destination);
        setRoute(routeData);
        onRouteLoaded?.(routeData);
      } catch (error) {
        console.error('Error loading route:', error);
        onRouteError?.(error as Error);
      } finally {
        setIsLoadingRoute(false);
      }
    };

    loadRoute();
  }, [showRoute, origin, destination, onRouteLoaded, onRouteError]);

  if (!center) {
    return (
      <div 
        aria-label={ariaLabel} 
        style={{ 
          height, 
          width: '100%', 
          borderRadius: 8, 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          backgroundColor: '#f3f4f6',
          color: '#6b7280'
        }}
      >
        No hay coordenadas para mostrar el mapa.
      </div>
    );
  }

  return (
    <div aria-label={ariaLabel} style={{ height, width: '100%', borderRadius: 8, overflow: 'hidden', position: 'relative' }}>
      {isLoadingRoute && (
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            fontSize: '14px',
            color: '#374151'
          }}
        >
          Cargando ruta...
        </div>
      )}
      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom={interactive}
        dragging={interactive}
        doubleClickZoom={interactive}
        zoomControl={interactive}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer url={tilesUrl} attribution='&copy; OpenStreetMap contributors' />
        {origin && (
          <CircleMarker 
            center={[origin.lat, origin.lng]} 
            radius={8} 
            pathOptions={{ color: '#2563EB', fillColor: '#3B82F6', fillOpacity: 0.7 }} 
          />
        )}
        {destination && (
          <CircleMarker 
            center={[destination.lat, destination.lng]} 
            radius={8} 
            pathOptions={{ color: '#059669', fillColor: '#10B981', fillOpacity: 0.7 }} 
          />
        )}
        {showRoute && <RouteDisplay route={route} />}
        <FitBounds origin={origin} destination={destination} />
      </MapContainer>
    </div>
  );
};

export default MapPreviewFixed;
