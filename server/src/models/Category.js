import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
      unique: true,
      maxLength: [50, 'Category name cannot exceed 50 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    parentCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      default: null,
      index: true,
    },
    description: {
      type: String,
      trim: true,
      maxLength: [200, 'Description cannot exceed 200 characters'],
    },
  },
  {
    timestamps: true,
  }
);

export const Category = mongoose.model('Category', categorySchema);
