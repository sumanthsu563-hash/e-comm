import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Product title is required'],
      trim: true,
      maxLength: [150, 'Product title cannot exceed 150 characters'],
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price must be greater than or equal to 0'],
      index: true,
    },
    stock: {
      type: Number,
      required: [true, 'Product stock is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        public_id: {
          type: String,
        },
      },
    ],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Product category is required'],
      index: true,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Product seller is required'],
      index: true,
    },
    ratings: {
      type: Number,
      default: 0,
      min: [0, 'Rating cannot be less than 0'],
      max: [5, 'Rating cannot exceed 5'],
      index: true,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review',
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Compound text index for title and description search
productSchema.index({ title: 'text', description: 'text' });

// Compound index for category and price sorting/filtering
productSchema.index({ category: 1, price: 1 });

export const Product = mongoose.model('Product', productSchema);
