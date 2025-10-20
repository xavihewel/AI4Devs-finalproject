import React from 'react';
import { MapContainer, TileLayer, CircleMarker } from 'react-leaflet';

interface MapPreviewDebugProps {
  origin?: { lat: number; lng: number } | null;
  destination?: { lat: number; lng: number } | null;
  height?: number | string;
}

export const MapPreviewDebug: React.FC<MapPreviewDebugProps> = ({
  origin,
  destination,
  height = 200,
}) => {
  const center = origin ? [origin.lat, origin.lng] : [41.3851, 2.1734]; // Barcelona por defecto

  return (
    <div style={{ height, width: '100%', border: '2px solid red', backgroundColor: '#f0f0f0' }}>
      <h3>Debug Map - Center: {JSON.stringify(center)}</h3>
      <div style={{ height: 'calc(100% - 40px)', width: '100%' }}>
        <MapContainer
          center={center as [number, number]}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer 
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
            attribution='&copy; OpenStreetMap contributors' 
          />
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
        </MapContainer>
      </div>
    </div>
  );
};

export default MapPreviewDebug;
