# Multi-Vendor E-Commerce Marketplace

A marketplace application built with React, Vite, Redux Toolkit, Express, MongoDB, and Mongoose. The repository is organized as an npm workspace with a React client and an Express API.

## Features

- Customer registration, login, refresh-token authentication, and profile access
- Product browsing and detail pages, with seller/admin product management
- Category listing and admin category management
- Cart, checkout, order history, and order status management
- Razorpay payment order creation and verification
- Cloudinary image uploads for seller/admin accounts
- Input validation, role-based access control, rate limiting, Helmet, and centralized API error handling
- Socket.IO server/client connection setup

## Project Structure

```text
client/   React 18 + Vite frontend
server/   Express API, Mongoose models, and Jest/Supertest tests
```

## Requirements

- Node.js 20 or newer
- npm
- MongoDB, local or MongoDB Atlas

Cloudinary, Razorpay, and SMTP credentials are needed to use their corresponding integrations. Razorpay should be configured with test credentials during development.

## Local Setup

Install dependencies from the repository root:

```powershell
npm install
```

Create the server environment file:

```powershell
Copy-Item server/.env.example server/.env
```

Edit `server/.env` and set at least:

- `MONGODB_URI` to your MongoDB connection string
- `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` to long, unique random values
- `CLIENT_URL` to the frontend origin (by default, `http://localhost:5173`)

Set the Cloudinary, Razorpay, and SMTP variables when enabling those integrations. Keep credentials in local environment files; do not commit them.

The client works without a `.env` file for local development. Vite serves it on port `5173` and proxies `/api` and `/socket.io` to the API at `http://localhost:5000`. To use a different API port, set `API_PROXY_TARGET` in the environment that starts Vite. For a separately hosted API, set `VITE_API_URL` to its `/api` URL and `VITE_SOCKET_URL` to its origin in `client/.env`.

Start the frontend and API together:

```powershell
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). The API health endpoint is [http://localhost:5000/api/health](http://localhost:5000/api/health).

You can also run each process separately from the repository root in two terminals:

```powershell
# Terminal 1
npm run server
# Terminal 2
npm run client
```

## API Overview

All endpoints are prefixed with `/api`.

| Method | Path | Access | Description |
| --- | --- | --- | --- |
| `GET` | `/health` | Public | API health check |
| `POST` | `/auth/register` | Public | Register an account |
| `POST` | `/auth/login` | Public | Log in |
| `POST` | `/auth/refresh-token` | Refresh token | Refresh the access token |
| `POST` | `/auth/logout` | Authenticated | Log out |
| `GET` | `/auth/me` | Authenticated | Get the current account |
| `GET` | `/products` | Public | List products |
| `GET` | `/products/:id` | Public | Get a product |
| `POST` | `/products` | Seller/admin | Create a product |
| `PUT` | `/products/:id` | Seller/admin | Update a product |
| `DELETE` | `/products/:id` | Seller/admin | Delete a product |
| `GET` | `/categories` | Public | List categories |
| `POST` | `/categories` | Admin | Create a category |
| `POST` | `/orders` | Customer | Create an order |
| `GET` | `/orders` | Authenticated | List accessible orders |
| `PATCH` | `/orders/:id/status` | Admin | Update order status |
| `POST` | `/payments/create-order` | Authenticated | Create a Razorpay order |
| `POST` | `/payments/verify` | Authenticated | Verify a Razorpay payment |
| `POST` | `/upload` | Seller/admin | Upload an image (`multipart/form-data`, field `image`) |

Protected routes require a valid access token. Request validation is applied to routes that accept validated input.

## Build and Tests

Build the frontend:

```powershell
npm run build
```

Run the server Jest/Supertest suite:

```powershell
npm run test:server
```

## Deployment Notes

- Provision a MongoDB database and deploy the API from `server/` using `npm start`.
- Configure the API environment variables in the hosting provider. Set `PORT` as required by the provider and set `CLIENT_URL` to the deployed frontend origin.
- Build the client with `npm run build --prefix client` and publish `client/dist` from a static frontend host.
- Set `VITE_API_URL` to the deployed API base URL ending in `/api`, and `VITE_SOCKET_URL` to the API origin. These are build-time frontend variables.
- Configure HTTPS, production-strength JWT secrets, and provider credentials before accepting real traffic. Never deploy the example values from `.env.example`.
