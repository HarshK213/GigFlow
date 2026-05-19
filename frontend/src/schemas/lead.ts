import { z } from 'zod';

const leadStatusEnum = z.enum(['New', 'Contacted', 'Qualified', 'Lost']);
const leadSourceEnum = z.enum(['Website', 'Instagram', 'Referral']);

export const createLeadSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  status: leadStatusEnum,
  source: leadSourceEnum,
});

export const updateLeadSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  email: z.string().email('Invalid email address').optional(),
  status: leadStatusEnum.optional(),
  source: leadSourceEnum.optional(),
});

export type CreateLeadFormData = z.infer<typeof createLeadSchema>;
export type UpdateLeadFormData = z.infer<typeof updateLeadSchema>;
