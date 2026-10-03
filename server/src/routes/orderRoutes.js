import express from 'express';
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
} from '../controllers/orderController.js';
import { protect, authorizeRoles } from '../middlewares/authMiddleware.js';
import { validate } from '../middlewares/validateMiddleware.js';
import {
  createOrderSchema,
  updateOrderStatusSchema,
} from '../validations/orderValidation.js';

const router = express.Router();

// All order routes require authentication
router.use(protect);

// Checkout (order creation) is limited to customers only
router.post('/', authorizeRoles('customer'), validate(createOrderSchema), createOrder);
router.get('/', getOrders);
router.patch(
  '/:id/status',
  authorizeRoles('admin'),
  validate(updateOrderStatusSchema),
  updateOrderStatus
);

export default router;
