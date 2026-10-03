import express from 'express';
import {
  createRazorpayOrder,
  verifyPayment,
} from '../controllers/paymentController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { validate } from '../middlewares/validateMiddleware.js';
import {
  createPaymentOrderSchema,
  verifyPaymentSchema,
} from '../validations/paymentValidation.js';

const router = express.Router();

router.use(protect); // Payment actions require user authentication

router.post('/create-order', validate(createPaymentOrderSchema), createRazorpayOrder);
router.post('/verify', validate(verifyPaymentSchema), verifyPayment);

export default router;
