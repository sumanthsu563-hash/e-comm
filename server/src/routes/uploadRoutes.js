import express from 'express';
import { uploadImage } from '../controllers/uploadController.js';
import { protect, authorizeRoles } from '../middlewares/authMiddleware.js';
import { upload } from '../config/cloudinary.js';

const router = express.Router();

router.post(
  '/',
  protect,
  authorizeRoles('seller', 'admin'),
  upload.single('image'),
  uploadImage
);

export default router;
