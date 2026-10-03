// server/tests/health.test.js
import request from 'supertest';
import app from '../src/app.js';

describe('Health Check', () => {
  it('should return 200 and status healthy', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('status', 'healthy');
  });
});
