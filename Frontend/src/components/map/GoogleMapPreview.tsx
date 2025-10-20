import React, { useCallback, useRef, useEffect } from 'react';
import { Wrapper, Status } from '@googlemaps/react-wrapper';

interface LatLng {
  lat: number;
  lng: number;
}

interface GoogleMapPreviewProps {
  origin?: LatLng | null;
  destination?: LatLng | null;
  height?: number | string;
  interactive?: boolean;
  ariaLabel?: string;
  showRoute?: boolean;
  onRouteLoaded?: (route: any) => void;
  onRouteError?: (error: Error) => void;
}

const MapComponent: React.FC<{
  origin?: LatLng | null;
  destination?: LatLng | null;
  interactive?: boolean;
  showRoute?: boolean;
  onRouteLoaded?: (route: any) => void;
  onRouteError?: (error: Error) => void;
}> = ({ origin, destination, interactive = false, showRoute = false, onRouteLoaded, onRouteError }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const directionsServiceRef = useRef<google.maps.DirectionsService | null>(null);
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(null);

  const initializeMap = useCallback(() => {
    if (!mapRef.current) return;

    const center = origin ? { lat: origin.lat, lng: origin.lng } : { lat: 41.3851, lng: 2.1734 };
    
    const map = new google.maps.Map(mapRef.current, {
      center,
      zoom: 13,
      disableDefaultUI: !interactive,
      zoomControl: interactive,
      scrollwheel: interactive,
      draggable: interactive,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    });

    mapInstanceRef.current = map;

    // Add markers
    if (origin) {
      new google.maps.Marker({
        position: { lat: origin.lat, lng: origin.lng },
        map,
        title: 'Origen',
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: '#2563EB',
          fillOpacity: 1,
          strokeColor: '#1D4ED8',
          strokeWeight: 2,
        },
      });
    }

    if (destination) {
      new google.maps.Marker({
        position: { lat: destination.lat, lng: destination.lng },
        map,
        title: 'Destino',
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: '#059669',
          fillOpacity: 1,
          strokeColor: '#047857',
          strokeWeight: 2,
        },
      });
    }

    // Fit bounds if both origin and destination exist
    if (origin && destination) {
      const bounds = new google.maps.LatLngBounds();
      bounds.extend({ lat: origin.lat, lng: origin.lng });
      bounds.extend({ lat: destination.lat, lng: destination.lng });
      map.fitBounds(bounds);
    }

    // Load route if requested
    if (showRoute && origin && destination) {
      directionsServiceRef.current = new google.maps.DirectionsService();
      directionsRendererRef.current = new google.maps.DirectionsRenderer({
        suppressMarkers: true, // We already have custom markers
        polylineOptions: {
          strokeColor: '#3B82F6',
          strokeWeight: 4,
          strokeOpacity: 0.8,
        },
      });
      directionsRendererRef.current.setMap(map);

      directionsServiceRef.current.route(
        {
          origin: { lat: origin.lat, lng: origin.lng },
          destination: { lat: destination.lat, lng: destination.lng },
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK && directionsRendererRef.current) {
            directionsRendererRef.current.setDirections(result);
            onRouteLoaded?.(result);
          } else {
            console.error('Error loading route:', status);
            onRouteError?.(new Error(`Route loading failed: ${status}`));
          }
        }
      );
    }
  }, [origin, destination, interactive, showRoute, onRouteLoaded, onRouteError]);

  useEffect(() => {
    if (window.google && window.google.maps) {
      initializeMap();
    }
  }, [initializeMap]);

  return <div ref={mapRef} style={{ height: '100%', width: '100%' }} />;
};

const render = (status: Status) => {
  switch (status) {
    case Status.LOADING:
      return (
        <div style={{ 
          height: '100%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          backgroundColor: '#f0f0f0',
          color: '#666'
        }}>
          Cargando mapa...
        </div>
      );
    case Status.FAILURE:
      return (
        <div style={{ 
          height: '100%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          backgroundColor: '#fee',
          color: '#c33'
        }}>
          Error al cargar el mapa
        </div>
      );
    default:
      return null;
  }
};

export const GoogleMapPreview: React.FC<GoogleMapPreviewProps> = ({
  origin,
  destination,
  height = 180,
  interactive = false,
  ariaLabel = 'Vista previa de mapa',
  showRoute = false,
  onRouteLoaded,
  onRouteError,
}) => {
  if (!origin && !destination) {
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
      <Wrapper apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''} render={render}>
        <MapComponent
          origin={origin}
          destination={destination}
          interactive={interactive}
          showRoute={showRoute}
          onRouteLoaded={onRouteLoaded}
          onRouteError={onRouteError}
        />
      </Wrapper>
    </div>
  );
};

export default GoogleMapPreview;
