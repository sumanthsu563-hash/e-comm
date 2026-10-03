import { Product } from '../models/Product.js';
import { Category } from '../models/Category.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiFeatures } from '../utils/apiFeatures.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getProducts = asyncHandler(async (req, res) => {
  const countFeatures = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter();
  const totalFilteredProducts = await countFeatures.query.countDocuments();

  const features = new ApiFeatures(
    Product.find()
      .populate('category', 'name slug')
      .populate('seller', 'name email'),
    req.query
  )
    .search()
    .filter()
    .sort()
    .paginate();

  const products = await features.query;
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.max(1, Math.min(100, parseInt(req.query.limit, 10) || 10));

  res.status(200).json(
    new ApiResponse(
      200,
      {
        products,
        pagination: {
          total: totalFilteredProducts,
          page,
          limit,
          totalPages: Math.ceil(totalFilteredProducts / limit),
        },
      },
      'Products retrieved successfully'
    )
  );
});

export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate('category', 'name slug')
    .populate('seller', 'name email');

  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  res
    .status(200)
    .json(new ApiResponse(200, product, 'Product details retrieved'));
});

export const createProduct = asyncHandler(async (req, res) => {
  const { title, description, price, stock, category, images } = req.body;

  const categoryExists = await Category.findById(category);
  if (!categoryExists) {
    throw new ApiError(404, 'Category does not exist');
  }

  const product = await Product.create({
    title,
    description,
    price,
    stock,
    category,
    images,
    seller: req.user._id,
  });

  const populatedProduct = await Product.findById(product._id)
    .populate('category', 'name slug')
    .populate('seller', 'name email');

  res
    .status(201)
    .json(
      new ApiResponse(201, populatedProduct, 'Product created successfully')
    );
});

export const updateProduct = asyncHandler(async (req, res) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  // Owner check: Ensure seller owns the product (or is an admin)
  if (
    product.seller.toString() !== req.user._id.toString() &&
    req.user.role !== 'admin'
  ) {
    throw new ApiError(403, 'Forbidden: You can only update your own products');
  }

  if (req.body.category) {
    const categoryExists = await Category.findById(req.body.category);
    if (!categoryExists) {
      throw new ApiError(404, 'Category does not exist');
    }
  }

  product = await Product.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true, runValidators: true }
  )
    .populate('category', 'name slug')
    .populate('seller', 'name email');

  res
    .status(200)
    .json(new ApiResponse(200, product, 'Product updated successfully'));
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  // Owner check: Ensure seller owns the product (or is an admin)
  if (
    product.seller.toString() !== req.user._id.toString() &&
    req.user.role !== 'admin'
  ) {
    throw new ApiError(403, 'Forbidden: You can only delete your own products');
  }

  await Product.findByIdAndDelete(req.params.id);

  res
    .status(200)
    .json(new ApiResponse(200, null, 'Product deleted successfully'));
});
