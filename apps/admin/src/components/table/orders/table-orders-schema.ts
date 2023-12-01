import { z } from 'zod';

export const tableOrdersSchema = z.object({
  id: z.string(),
  total_price: z.number().nonnegative().default(0.0),
  payment: z.string().default(''),
  order_status: z.string().default(''),
  payment_status: z.boolean().default(false),
  last_updated: z.string(),
  created_at: z.string(),
  customers: z.object({
    full_name: z.string().default(''),
    email: z.string().default(''),
    phone: z.string().default(''),
    shipping_address: z.string().default(''),
    billing_address: z.string().default(''),
  }),
});

export const orderDetailsSchema = z.object({
  id: z.nullable(z.number()),
  qty: z.number(),
  product: z.object({
    id: z.number(),
    sku: z.string(),
    name: z.string(),
    type: z.string(),
    price: z.number(),
  }),
});

export type Orders = z.infer<typeof tableOrdersSchema>;
export type OrderDetails = z.infer<typeof orderDetailsSchema>;
