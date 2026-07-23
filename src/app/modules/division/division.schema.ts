import z from 'zod';

export const createDivisionSchema = z.object({
  name: z
    .string()
    .min(1, 'Division name is required')
    .max(100, 'Division name cannot exceed 100 characters'),
  thumbnail: z.string().optional(),
  description: z.string().optional(),
});
export const updateDivisionSchema = z.object({
  name: z
    .string()
    .min(1, 'Division name is required')
    .max(100, 'Division name cannot exceed 100 characters')
    .optional(),
  thumbnail: z.string().optional(),
  description: z.string().optional(),
});
