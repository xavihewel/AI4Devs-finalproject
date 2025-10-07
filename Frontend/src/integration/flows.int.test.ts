import axios from 'axios';

const API = process.env.VITE_API_BASE_URL || 'http://localhost:8081';
const itIf = (cond: boolean) => (cond ? it : it.skip);

describe('Integration: domain happy paths (requires backend running)', () => {
  itIf(!!process.env.RUN_INT)('Trips list returns array', async () => {
    const res = await axios.get(`${API}/trips`, { timeout: 5000 });
    expect(res.status).toBe(200);
    expect(Array.isArray(res.data)).toBe(true);
  });

  itIf(!!process.env.RUN_INT)('Matches search with destination returns array', async () => {
    const res = await axios.get(`${API.replace('8081', '8084')}/matches?destinationSedeId=SEDE-1`, { timeout: 5000 });
    expect(res.status).toBe(200);
    expect(Array.isArray(res.data)).toBe(true);
  });
});


