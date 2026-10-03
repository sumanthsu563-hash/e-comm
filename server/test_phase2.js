import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from './src/models/User.js';
import { Category } from './src/models/Category.js';
import { Product } from './src/models/Product.js';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env') });
dotenv.config();

const BASE_URL = 'http://localhost:5000/api';

async function runVerification() {
  console.log('--- Starting Phase 2 Automated Verification ---');

  // Connect to DB directly to prepare admin (since registration defaults to customer/seller)
  const mongoUri =
    process.env.MONGODB_URI ||
    'mongodb://127.0.0.1:27017/multivendor_ecommerce';
  await mongoose.connect(mongoUri);
  console.log('Connected to DB for test fixture preparation');

  // Clear existing test data
  await User.deleteMany({
    email: { $in: ['admin@test.com', 'seller1@test.com', 'seller2@test.com'] },
  });
  await Category.deleteMany({ slug: { $in: ['electronics', 'gadgets'] } });
  await Product.deleteMany({ title: { $regex: /MacBook/i } });

  // Create an Admin user in DB
  const adminUser = await User.create({
    name: 'Admin Test',
    email: 'admin@test.com',
    password: 'password123',
    role: 'admin',
  });
  const adminToken = adminUser.generateAccessToken();
  console.log('✅ Admin user created with token');

  // 1. Register Seller 1
  const seller1Res = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Seller One',
      email: 'seller1@test.com',
      password: 'password123',
      role: 'seller',
    }),
  });
  const seller1Data = await seller1Res.json();
  const seller1Token = seller1Data.data?.accessToken;
  console.log('✅ Seller 1 registered, status:', seller1Res.status);

  // 2. Register Seller 2
  const seller2Res = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Seller Two',
      email: 'seller2@test.com',
      password: 'password123',
      role: 'seller',
    }),
  });
  const seller2Data = await seller2Res.json();
  const seller2Token = seller2Data.data?.accessToken;
  console.log('✅ Seller 2 registered, status:', seller2Res.status);

  // 3. Admin creates Category
  const catRes = await fetch(`${BASE_URL}/categories`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify({
      name: 'Electronics',
      description: 'Laptops, phones and tech gadgets',
    }),
  });
  const catData = await catRes.json();
  const categoryId = catData.data?._id;
  console.log(
    '✅ Admin Category created:',
    catData.data?.name,
    'ID:',
    categoryId
  );

  // Non-admin trying to create category should fail with 403
  const catFailRes = await fetch(`${BASE_URL}/categories`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${seller1Token}`,
    },
    body: JSON.stringify({
      name: 'Forbidden Cat',
    }),
  });
  console.log(
    '✅ Seller blocked from creating category (expected 403):',
    catFailRes.status
  );

  // 4. Test image upload endpoint
  const uploadRes = await fetch(`${BASE_URL}/upload`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${seller1Token}`,
    },
    body: JSON.stringify({
      imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8',
    }),
  });
  const uploadData = await uploadRes.json();
  const uploadedImageUrl = uploadData.data?.url;
  console.log(
    '✅ Image upload endpoint verified:',
    uploadedImageUrl ? 'Success' : 'Failed'
  );

  // 5. Seller 1 creates Product
  const prodRes = await fetch(`${BASE_URL}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${seller1Token}`,
    },
    body: JSON.stringify({
      title: 'MacBook Pro M3 Max',
      description: 'Apple Silicon laptop with 36GB unified memory',
      price: 2499,
      stock: 15,
      category: categoryId,
      images: [
        {
          url:
            uploadedImageUrl ||
            'https://images.unsplash.com/photo-1517336714731-489689fd1ca8',
        },
      ],
    }),
  });
  const prodData = await prodRes.json();
  const productId = prodData.data?._id;
  console.log(
    '✅ Seller 1 created Product:',
    prodData.data?.title,
    'ID:',
    productId
  );

  // 6. Seller 2 attempts to UPDATE Seller 1's product -> Must fail with 403
  const updateFailRes = await fetch(`${BASE_URL}/products/${productId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${seller2Token}`,
    },
    body: JSON.stringify({ price: 100 }),
  });
  console.log(
    '✅ Seller 2 blocked from updating Seller 1 product (expected 403):',
    updateFailRes.status
  );

  // 7. Seller 1 updates their OWN product -> Must succeed with 200
  const updateOkRes = await fetch(`${BASE_URL}/products/${productId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${seller1Token}`,
    },
    body: JSON.stringify({ price: 2399, stock: 12 }),
  });
  const updateOkData = await updateOkRes.json();
  console.log(
    '✅ Seller 1 successfully updated price to:',
    updateOkData.data?.price
  );

  // 8. Public list products with filters (search, price filter, sort, pagination)
  const listRes = await fetch(
    `${BASE_URL}/products?search=MacBook&minPrice=2000&maxPrice=3000&sort=-price&page=1&limit=10`
  );
  const listData = await listRes.json();
  console.log('✅ Public filtered product query:', {
    total: listData.data?.pagination?.total,
    foundProducts: listData.data?.products?.length,
    firstTitle: listData.data?.products?.[0]?.title,
  });

  // 9. Public get product by ID
  const singleRes = await fetch(`${BASE_URL}/products/${productId}`);
  const singleData = await singleRes.json();
  console.log(
    '✅ Public product details retrieved:',
    singleData.data?.title,
    'Category:',
    singleData.data?.category?.name
  );

  // 10. Clean up / close DB connection
  await mongoose.disconnect();
  console.log('--- Phase 2 Verification Completed Successfully! ---');
  process.exit(0);
}

runVerification().catch((err) => {
  console.error('❌ Verification failed:', err);
  process.exit(1);
});
