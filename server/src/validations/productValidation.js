import { z } from 'zod';

export const createCategorySchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(2, 'Category name must be at least 2 characters')
      .max(50),
    slug: z.string().optional(),
    parentCategory: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, 'Invalid parent category ID')
      .optional()
      .nullable(),
    description: z.string().max(200).optional(),
  }),
});

export const createProductSchema = z.object({
  body: z.object({
    title: z.string().min(3, 'Title must be at least 3 characters').max(150),
    description: z
      .string()
      .min(10, 'Description must be at least 10 characters'),
    price: z.number().positive('Price must be greater than 0'),
    stock: z.number().int().min(0, 'Stock cannot be negative').default(0),
    category: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid category ID'),
    images: z
      .array(
        z.object({
          url: z.string().url('Invalid image URL'),
          public_id: z.string().optional(),
        })
      )
      .min(1, 'At least one image is required'),
  }),
});

export const updateProductSchema = z.object({
  body: z.object({
    title: z.string().min(3).max(150).optional(),
    description: z.string().min(10).optional(),
    price: z.number().positive().optional(),
    stock: z.number().int().min(0).optional(),
    category: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, 'Invalid category ID')
      .optional(),
    images: z
      .array(
        z.object({
          url: z.string().url(),
          public_id: z.string().optional(),
        })
      )
      .optional(),
  }),
});
