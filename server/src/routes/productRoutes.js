import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';
import { protect, authorizeRoles } from '../middlewares/authMiddleware.js';
import { validate } from '../middlewares/validateMiddleware.js';
import {
  createProductSchema,
  updateProductSchema,
} from '../validations/productValidation.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/:id', getProductById);

router.post(
  '/',
  protect,
  authorizeRoles('seller', 'admin'),
  validate(createProductSchema),
  createProduct
);

router.put(
  '/:id',
  protect,
  authorizeRoles('seller', 'admin'),
  validate(updateProductSchema),
  updateProduct
);

router.delete(
  '/:id',
  protect,
  authorizeRoles('seller', 'admin'),
  deleteProduct
);

export default router;
