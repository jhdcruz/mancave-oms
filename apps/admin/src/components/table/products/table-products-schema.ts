import { z } from 'zod';

export const tableProductsSchema = z.object({
  id: z.number(),
  sku: z.string(),
  image_url: z.nullable(z.string()),
  name: z.string(),
  description: z.nullable(z.string()),
  type: z.string(),
  qty: z.number(),
  last_updated: z.string(),
  published: z.boolean(),
});

export type Products = z.infer<typeof tableProductsSchema>;
