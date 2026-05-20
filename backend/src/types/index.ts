import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export const createLeadSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
  status: z.enum(['New', 'Contacted', 'Qualified', 'Lost']).optional().default('New'),
  source: z.enum(['Website', 'Instagram', 'Referral']).optional().default('Website'),
});

export const updateLeadSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  status: z.enum(['New', 'Contacted', 'Qualified', 'Lost']).optional(),
  source: z.enum(['Website', 'Instagram', 'Referral']).optional(),
});

export const leadQuerySchema = z.object({
	status: z.enum(["New", "Contacted", "Qualified", "Lost"]).optional(),

	source: z.enum(["Website", "Instagram", "Referral"]).optional(),

	search: z.string().optional(),

	page: z.coerce.number().min(1).default(1),

	limit: z.coerce.number().min(1).max(100).default(10),

	sort: z.enum(["latest", "oldest"]).default("latest"),
});

export const bulkImportSchema = z.object({
  leads: z
    .array(
      z.object({
        name: z.string().min(1, 'Name is required'),
        email: z.string().email('Invalid email format'),
        status: z
          .enum(['New', 'Contacted', 'Qualified', 'Lost'])
          .optional()
          .default('New'),
        source: z
          .enum(['Website', 'Instagram', 'Referral'])
          .optional()
          .default('Website'),
      })
    )
    .min(1, 'At least one lead is required')
    .max(500, 'Maximum 500 leads per import'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateLeadInput = z.infer<typeof createLeadSchema>;
export type UpdateLeadInput = z.infer<typeof updateLeadSchema>;
export type LeadQueryInput = z.infer<typeof leadQuerySchema>;
export type BulkImportInput = z.infer<typeof bulkImportSchema>;
