import z from 'zod';

export const tourTypeSchema = z.object({
  name: z
    .string()
    .min(1, 'Tour type is required')
    .max(100, 'Tour type cannot exceed 100 characters'),
});
