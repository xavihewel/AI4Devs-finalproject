import axios from 'axios';

const base = process.env.VITE_API_BASE_URL || 'http://localhost:8081';

const itIf = (cond: boolean) => (cond ? it : it.skip);

describe('Integration: health endpoints', () => {
  itIf(!!process.env.RUN_INT)('trips-service /health responds 200', async () => {
    const res = await axios.get(`${base}/health`, { timeout: 3000 });
    expect(res.status).toBe(200);
  });
});


