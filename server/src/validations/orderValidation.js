import { z } from 'zod';

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ID');

export const createOrderSchema = z.object({
  body: z
    .object({
      items: z
        .array(
          z.object({
            product: objectId,
            quantity: z.number().int().min(1).max(100),
          })
        )
        .min(1, 'At least one order item is required')
        .max(50, 'An order can contain at most 50 items')
        .superRefine((items, ctx) => {
          const productIds = new Set();
          items.forEach((item, index) => {
            if (productIds.has(item.product)) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: [index, 'product'],
                message: 'A product may appear only once in an order',
              });
            }
            productIds.add(item.product);
          });
        }),
      shippingAddress: z.object({
        street: z.string().trim().min(3).max(150),
        city: z.string().trim().min(2).max(80),
        state: z.string().trim().min(2).max(80),
        postalCode: z.string().trim().min(3).max(20),
        country: z.string().trim().min(2).max(80).default('India'),
        phone: z.string().trim().min(7).max(20),
      }),
    })
    .strict(),
});

export const updateOrderStatusSchema = z.object({
  body: z
    .object({
      status: z.enum(['processing', 'shipped', 'delivered', 'cancelled']),
    })
    .strict(),
  params: z.object({ id: objectId }),
});
