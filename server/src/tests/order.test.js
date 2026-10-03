import request from 'supertest';
import app from '../app.js';
import { connect, closeDatabase } from './setupTestDB.js';
import { Category } from '../models/Category.js';
import { Product } from '../models/Product.js';

let customerToken = '';
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
      email: 'seller@e.com',
      password: 'Password123',
      role: 'seller',
    })
    .expect(201);
  const sellerLogin = await request(app)
    .post('/api/auth/login')
    .send({ email: 'seller@e.com', password: 'Password123' })
    .expect(200);
  sellerToken = sellerLogin.body.data.accessToken;
  const category = await Category.create({
    name: 'Order Category',
    slug: 'order-category',
  });
  categoryId = category._id.toString();

  // Seller creates a product
  const prodRes = await request(app)
    .post('/api/products')
    .set('Authorization', `Bearer ${sellerToken}`)
    .send({
      title: 'Sample Product',
      description: 'Sample product description',
      price: 100,
      stock: 10,
      category: categoryId,
      images: [{ url: 'https://example.com/sample.jpg' }],
    })
    .expect(201);
  productId = prodRes.body.data._id;

  // Register customer
  await request(app)
    .post('/api/auth/register')
    .send({
      name: 'Customer',
      email: 'cust@e.com',
      password: 'Password123',
      role: 'customer',
    })
    .expect(201);
  const custLogin = await request(app)
    .post('/api/auth/login')
    .send({ email: 'cust@e.com', password: 'Password123' })
    .expect(200);
  customerToken = custLogin.body.data.accessToken;
});

afterAll(async () => {
  await closeDatabase();
});

describe('Order Endpoints', () => {
  it('customer can place an order', async () => {
    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        items: [{ product: productId, quantity: 2 }],
        shippingAddress: {
          street: '123 Main St',
          city: 'Mumbai',
          state: 'Maharashtra',
          postalCode: '400001',
          country: 'India',
          phone: '9876543210',
        },
      })
      .expect(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('_id');
  });

  it('seller can view orders containing their products', async () => {
    // Customer creates order first
    await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        items: [{ product: productId, quantity: 1 }],
        shippingAddress: {
          street: '123 Main St',
          city: 'Mumbai',
          state: 'Maharashtra',
          postalCode: '400001',
          country: 'India',
          phone: '9876543210',
        },
      })
      .expect(201);
    // Seller fetches orders
    const res = await request(app)
      .get('/api/orders')
      .set('Authorization', `Bearer ${sellerToken}`)
      .expect(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data.orders)).toBe(true);
    expect(res.body.data.orders.length).toBeGreaterThanOrEqual(1);
  });

  it('rejects invalid quantities before changing inventory', async () => {
    const productBefore = await Product.findById(productId);

    await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        items: [{ product: productId, quantity: -1 }],
        shippingAddress: {
          street: '123 Main St',
          city: 'Mumbai',
          state: 'Maharashtra',
          postalCode: '400001',
          country: 'India',
          phone: '9876543210',
        },
      })
      .expect(400);

    const productAfter = await Product.findById(productId);
    expect(productAfter.stock).toBe(productBefore.stock);
  });

  it('prevents another customer from confirming a payment', async () => {
    const orderResponse = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        items: [{ product: productId, quantity: 1 }],
        shippingAddress: {
          street: '123 Main St',
          city: 'Mumbai',
          state: 'Maharashtra',
          postalCode: '400001',
          country: 'India',
          phone: '9876543210',
        },
      })
      .expect(201);

    const orderId = orderResponse.body.data._id;
    const paymentOrder = await request(app)
      .post('/api/payments/create-order')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ orderId })
      .expect(200);

    await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Other Customer',
        email: 'other-customer@e.com',
        password: 'Password123',
      })
      .expect(201);
    const otherLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: 'other-customer@e.com', password: 'Password123' })
      .expect(200);

    await request(app)
      .post('/api/payments/verify')
      .set('Authorization', `Bearer ${otherLogin.body.data.accessToken}`)
      .send({
        orderId,
        razorpayOrderId: paymentOrder.body.data.razorpayOrderId,
        razorpayPaymentId: 'payment_mock_1',
        razorpaySignature: 'mock_sig_valid',
      })
      .expect(403);
  });
});
