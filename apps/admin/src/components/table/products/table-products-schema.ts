import { z } from 'zod';

export const tableProductsSchema = z.object({
  id: z.number(),
  sku: z.string(),
  image_url: z.string(),
  name: z.string(),
  description: z.string(),
  type: z.string(),
  qty: z.number(),
  last_updated: z.string(),
  disabled: z.boolean(),
});

export type Products = z.infer<typeof tableProductsSchema>;
