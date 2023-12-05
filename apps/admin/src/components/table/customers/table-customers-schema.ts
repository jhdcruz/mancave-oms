import { z } from 'zod';

export const tableCustomersSchema = z.object({
  id: z.string(),
  full_name: z.string().default(''),
  email: z.string().default(''),
  phone: z.string().default(''),
  avatar_url: z.nullable(z.string().default('')),
  created_at: z.string(),
  shipping_address: z.string().default(''),
  billing_address: z.nullable(z.string()).default(''),
  last_updated: z.string(),
  active: z.boolean().default(false),
});

export type Customer = z.infer<typeof tableCustomersSchema>;
