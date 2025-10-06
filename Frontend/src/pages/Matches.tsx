import React, { useEffect, useState } from 'react';
import { api } from '../api/client';

type Match = { tripId: string; score: number };

export default function Matches() {
  const [matches, setMatches] = useState<Match[]>([]);
  useEffect(() => {
    api.get('/matches').then((r) => setMatches(r.data ?? []));
  }, []);
  return (
    <div style={{ padding: 24 }}>
      <h2>Matches</h2>
      <ul>
        {matches.map((m, i) => (
          <li key={i}>
            Trip {m.tripId}: score {m.score}
          </li>
        ))}
      </ul>
    </div>
  );
}

