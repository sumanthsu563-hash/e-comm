import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1'],
  },
  image: {
    type: String,
    required: true,
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

const shippingAddressSchema = new mongoose.Schema({
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true, default: 'India' },
  phone: { type: String, required: true },
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    items: [orderItemSchema],
    shippingAddress: {
      type: shippingAddressSchema,
      required: true,
    },
    itemsPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    taxPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    shippingPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    totalAmount: {
      type: Number,
      required: true,
      default: 0.0,
    },
    status: {
      type: String,
      enum: [
        'pending',
        'paid',
        'processing',
        'shipped',
        'delivered',
        'cancelled',
      ],
      default: 'pending',
      index: true,
    },
    statusHistory: [
      {
        status: {
          type: String,
          enum: [
            'pending',
            'paid',
            'processing',
            'shipped',
            'delivered',
            'cancelled',
          ],
          required: true,
        },
        changedAt: { type: Date, default: Date.now },
        changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      },
    ],
    paymentInfo: {
      id: { type: String },
      razorpayOrderId: { type: String },
      razorpaySignature: { type: String },
      status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending',
      },
    },
    paidAt: {
      type: Date,
    },
    deliveredAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for query performance
orderSchema.index({ 'items.seller': 1 });
orderSchema.index({ createdAt: -1 });

export const Order = mongoose.model('Order', orderSchema);
