import request from 'supertest';
import app from '../app.js';
import { connect, closeDatabase, clearDatabase } from './setupTestDB.js';

beforeAll(async () => {
  await connect();
});

afterAll(async () => {
  await closeDatabase();
});

beforeEach(async () => {
  await clearDatabase();
});

describe('Auth Endpoints', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123',
      })
      .expect(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('accessToken');
  });

  it('should login an existing user', async () => {
    // First register
    await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Login User',
        email: 'login@example.com',
        password: 'Password123',
      })
      .expect(201);
    // Then login
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'login@example.com', password: 'Password123' })
      .expect(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('accessToken');
  });
});
