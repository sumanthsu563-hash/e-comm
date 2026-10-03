# Antigravity Rules – Multi‑Vendor E‑commerce (MERN)

## Goal
Build a production‑ready, multi‑vendor e‑commerce marketplace using MongoDB, Express, React (Vite), and Node.js.

## Tech Stack (fixed – do not change without asking)
- Frontend: React 18 + Vite, React Router, Redux Toolkit, Tailwind CSS, Axios, React Query (optional)
- Backend: Node.js 20+, Express, Mongoose, JWT, bcrypt, Zod/Joi validation
- Database: MongoDB Atlas
- File storage: Cloudinary (images)
- Payments: Razorpay (India) with test mode; Stripe as optional alternative
- Realtime: Socket.io (order notifications)
- Email: Nodemailer + Brevo/Sendgrid (test)
- Deployment: Frontend on Vercel/Netlify, Backend on Render/Railway, DB on Atlas

## Architecture
- Monorepo with two folders:
  - `client/` – React app
  - `server/` – Express API
- Backend follows MVC:
  - `controllers/`, `routes/`, `models/`, `middlewares/`, `utils/`, `config/`
- Use environment variables for all secrets; never commit `.env` files.

## Security & Quality Rules
- Always:
  - Use JWT auth with refresh tokens.
  - Hash passwords with bcrypt.
  - Validate all inputs with Zod/Joi.
  - Implement role-based access control (customer, seller, admin).
  - Add rate limiting, CORS, Helmet, and basic error-handling middleware.
  - Use pagination, sorting, and filtering on list APIs.
- Never:
  - Hardcode secrets or keys.
  - Expose stack traces in production responses.
  - Allow direct access to `.env` files.

## Workflow Rules
- Work in small, reviewable phases.
- After each phase:
  - Summarize what was done.
  - List files created/modified.
  - Provide commands to run locally.
  - Wait for explicit approval before continuing.
- For any infrastructure/auth step (e.g., deployment login, payment keys), ask me to run it manually.

## Testing & Docs
- Add basic Jest + Supertest tests for:
  - Auth (register/login)
  - Products CRUD (seller)
  - Orders CRUD (customer + seller)
- Maintain a clear README with:
  - Project overview
  - Features
  - Setup instructions (local + env vars)
  - API endpoints summary
  - Deployment notes
