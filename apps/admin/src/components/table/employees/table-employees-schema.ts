import { z } from 'zod';

export const tableEmployeesSchema = z.object({
  id: z.string(),
  first_name: z.string().default(''),
  last_name: z.string().default(''),
  middle_name: z.string().default(''),
  email: z.string().default(''),
  phone: z.string().default(''),
  avatar_url: z.nullable(z.string().default('')),
  created_at: z.string(),
  last_updated: z.string(),
  active: z.boolean().default(false),
  role: z.string().default(''),
  auth_provider: z.boolean().default(false),
});

export type Employee = z.infer<typeof tableEmployeesSchema>;
