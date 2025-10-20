import React, { useState } from 'react';
import MapPreviewDebug from '../components/map/MapPreview.debug';
import MapPreview from '../components/map/MapPreview';

export default function MapDebug() {
  const [showDebug, setShowDebug] = useState(true);
  
  const testOrigin = { lat: 41.3851, lng: 2.1734 }; // Barcelona
  const testDestination = { lat: 41.4036, lng: 2.1744 }; // Barcelona

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Map Debug Page</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={() => setShowDebug(!showDebug)}
          style={{ padding: '10px 20px', marginRight: '10px' }}
        >
          {showDebug ? 'Show Normal Map' : 'Show Debug Map'}
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>Test Coordinates:</h2>
        <p>Origin: {JSON.stringify(testOrigin)}</p>
        <p>Destination: {JSON.stringify(testDestination)}</p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>Debug Map (with border):</h2>
        {showDebug ? (
          <MapPreviewDebug 
            origin={testOrigin}
            destination={testDestination}
            height={300}
          />
        ) : (
          <MapPreview 
            origin={testOrigin}
            destination={testDestination}
            height={300}
          />
        )}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>Normal Map:</h2>
        <MapPreview 
          origin={testOrigin}
          destination={testDestination}
          height={300}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>Map with Route:</h2>
        <MapPreview 
          origin={testOrigin}
          destination={testDestination}
          height={300}
          showRoute={true}
        />
      </div>
    </div>
  );
}
