import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { cloudinary, isCloudinaryConfigured } from '../config/cloudinary.js';

const uploadToCloudinary = (file) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'ecommerce_products',
        resource_type: 'image',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      },
      (error, result) => (error ? reject(error) : resolve(result))
    );
    stream.end(file.buffer);
  });

export const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, 'Please provide an image file');
  }

  if (process.env.NODE_ENV === 'production' && !isCloudinaryConfigured()) {
    throw new ApiError(503, 'Image uploads are unavailable until Cloudinary is configured');
  }

  if (isCloudinaryConfigured()) {
    const result = await uploadToCloudinary(req.file);
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          url: result.secure_url,
          public_id: result.public_id,
        },
        'Image uploaded successfully'
      )
    );
  }

  // Fallback for local memory storage when real Cloudinary credentials are not provided
  if (req.file && req.file.buffer) {
    const base64Data = req.file.buffer.toString('base64');
    const mimeType = req.file.mimetype || 'image/jpeg';
    const dataUri = `data:${mimeType};base64,${base64Data}`;

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          url: dataUri,
          public_id: `dev_${Date.now()}`,
        },
        'Image uploaded successfully (local fallback)'
      )
    );
  }

  throw new ApiError(500, 'Image upload failed');
});
