import { Category } from '../models/Category.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getCategories = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.max(1, Math.min(100, parseInt(req.query.limit, 10) || 20));
  const skip = (page - 1) * limit;

  const totalCategories = await Category.countDocuments();
  const categories = await Category.find()
    .populate('parentCategory', 'name slug')
    .sort({ name: 1 })
    .skip(skip)
    .limit(limit);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        categories,
        pagination: {
          total: totalCategories,
          page,
          limit,
          totalPages: Math.ceil(totalCategories / limit),
        },
      },
      'Categories fetched successfully'
    )
  );
});

export const createCategory = asyncHandler(async (req, res) => {
  const { name, slug, parentCategory, description } = req.body;

  const categorySlug = slug
    ? slug.toLowerCase().replace(/\s+/g, '-')
    : name
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');

  const existingCategory = await Category.findOne({
    $or: [{ name }, { slug: categorySlug }],
  });

  if (existingCategory) {
    throw new ApiError(400, 'Category with this name or slug already exists');
  }

  if (parentCategory) {
    const parentExists = await Category.findById(parentCategory);
    if (!parentExists) {
      throw new ApiError(404, 'Parent category not found');
    }
  }

  const category = await Category.create({
    name,
    slug: categorySlug,
    parentCategory: parentCategory || null,
    description,
  });

  res
    .status(201)
    .json(new ApiResponse(201, category, 'Category created successfully'));
});
