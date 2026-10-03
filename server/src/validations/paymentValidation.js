import { z } from 'zod';

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid order ID');

export const createPaymentOrderSchema = z.object({
  body: z.object({ orderId: objectId }).strict(),
});

export const verifyPaymentSchema = z.object({
  body: z
    .object({
      orderId: objectId,
      razorpayOrderId: z.string().min(1).max(100),
      razorpayPaymentId: z.string().min(1).max(100),
      razorpaySignature: z.string().min(1).max(200),
    })
    .strict(),
});
