import request from 'supertest';
import app from '../app.js';
import { connect, closeDatabase } from './setupTestDB.js';
import { Category } from '../models/Category.js';

let sellerToken = '';
let productId = '';
let categoryId = '';

beforeAll(async () => {
  await connect();
  // Register seller
  await request(app)
    .post('/api/auth/register')
    .send({
      name: 'Seller',
      email: 'seller@example.com',
      password: 'Password123',
      role: 'seller',
    })
    .expect(201);
  const loginRes = await request(app)
    .post('/api/auth/login')
    .send({ email: 'seller@example.com', password: 'Password123' })
    .expect(200);
  sellerToken = loginRes.body.data.accessToken;
  const category = await Category.create({
    name: 'Test Category',
    slug: 'test-category',
  });
  categoryId = category._id.toString();
});

afterAll(async () => {
  await closeDatabase();
});

describe('Product Endpoints (Seller)', () => {
  it('should create a product', async () => {
    const res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${sellerToken}`)
      .send({
        title: 'Test Product',
        description: 'Product description',
        price: 100,
        category: categoryId,
        images: [{ url: 'https://example.com/product.jpg' }],
      })
      .expect(201);
    expect(res.body.success).toBe(true);
    productId = res.body.data._id;
  });

  it('should list products', async () => {
    // Ensure one product exists
    await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${sellerToken}`)
      .send({
        title: 'ListProduct',
        description: 'Product description',
        price: 50,
        category: categoryId,
        images: [{ url: 'https://example.com/list.jpg' }],
      })
      .expect(201);
    const res = await request(app).get('/api/products').expect(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data.products)).toBe(true);
    expect(res.body.data.products.length).toBeGreaterThanOrEqual(1);
  });

  it('should update a product', async () => {
    const createRes = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${sellerToken}`)
      .send({
        title: 'UpdProd',
        description: 'Product description',
        price: 30,
        category: categoryId,
        images: [{ url: 'https://example.com/update.jpg' }],
      })
      .expect(201);
    const id = createRes.body.data._id;
    const res = await request(app)
      .put(`/api/products/${id}`)
      .set('Authorization', `Bearer ${sellerToken}`)
      .send({ title: 'Updated Name', price: 35 })
      .expect(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe('Updated Name');
  });

  it('should delete a product', async () => {
    const createRes = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${sellerToken}`)
      .send({
        title: 'DelProd',
        description: 'Product description',
        price: 20,
        category: categoryId,
        images: [{ url: 'https://example.com/delete.jpg' }],
      })
      .expect(201);
    const id = createRes.body.data._id;
    await request(app)
      .delete(`/api/products/${id}`)
      .set('Authorization', `Bearer ${sellerToken}`)
      .expect(200);
  });
});
