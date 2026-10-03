import express from 'express';
import {
  getCategories,
  createCategory,
} from '../controllers/categoryController.js';
import { protect, authorizeRoles } from '../middlewares/authMiddleware.js';
import { validate } from '../middlewares/validateMiddleware.js';
import { createCategorySchema } from '../validations/productValidation.js';

const router = express.Router();

router.get('/', getCategories);
router.post(
  '/',
  protect,
  authorizeRoles('admin'),
  validate(createCategorySchema),
  createCategory
);

export default router;
