import { z } from 'zod';

export const tableProductsSchema = z.object({
  id: z.number(),
  sku: z.string().default(''),
  image_url: z.nullable(z.string()).default(''),
  name: z.string().default(''),
  description: z.nullable(z.string()).default(''),
  price: z.number().default(0.0),
  type: z.string().default(''),
  qty: z.number().default(0),
  last_updated: z.string(),
  published: z.boolean().default(false),
});

export type Products = z.infer<typeof tableProductsSchema>;
