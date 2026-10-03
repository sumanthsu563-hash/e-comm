import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const isCloudinaryConfigured = () => {
  return (
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_CLOUD_NAME !== 'mock_cloud' &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_KEY !== 'mock_key'
  );
};

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 1, fields: 10 },
  fileFilter: (req, file, callback) => {
    const allowedMimeTypes = new Set([
      'image/jpeg',
      'image/png',
      'image/webp',
    ]);
    if (!allowedMimeTypes.has(file.mimetype)) {
      return callback(new Error('Only JPEG, PNG, and WebP image uploads are allowed'));
    }
    callback(null, true);
  },
});

export { cloudinary, isCloudinaryConfigured };
