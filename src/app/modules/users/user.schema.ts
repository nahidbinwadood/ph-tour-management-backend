import z from 'zod';

export const createUserSchema = z.object({
  name: z.string({ message: 'Name is require' }).min(1, 'Name is required'),
  email: z.email({ message: 'Enter a valid email' }),
  password: z.string().min(1, 'Password is required'),
  phone: z.string().min(1, 'Phone is required'),
  isDeleted: z.boolean().optional(),
  picture: z.string().optional(),
});

export const loginUserSchema = z.object({
  email: z.email({ message: 'Enter a valid email' }),
  password: z.string().min(1, 'Password is required'),
});
