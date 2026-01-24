import z from 'zod';
import { IsActive, Role } from './user.interface';

export const createUserSchema = z.object({
  name: z
    .string({ message: 'Name is require' })
    .min(2, 'Name must be at least 2 characters long')
    .max(50, 'Name cannot exceed 50 characters'),
  email: z
    .email({ message: 'Enter a valid email' })
    .min(5, 'Email must be at least 5 characters long'),
  password: z
    .string('Password must be a string')
    .min(8, 'Password must be 8 characters long')
    .regex(/^(?=.*[A-Z])/, 'Password must contain at least 1 uppercase letter')
    .regex(
      /^(?=.*[!@#$%^&*])/,
      'Password must contain at least 1 special character.'
    )
    .regex(/^(?=.*\d)/, 'Password must contain at least 1 number.'),
  phone: z
    .string('Phone number must be string')
    .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
      message:
        'Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX',
    })
    .optional(),
  address: z
    .string('Address must be string')
    .max(200, { message: 'Address cannot exceed 200 characters.' })
    .optional(),
});

export const loginUserSchema = z.object({
  email: z.email({ message: 'Enter a valid email' }),
  password: z.string().min(1, 'Password is required'),
});

export const updateUserSchema = z.object({
  name: z
    .string('Name must be string')
    .min(2, { message: 'Name must be at least 2 characters long.' })
    .max(50, { message: 'Name cannot exceed 50 characters.' })
    .optional(),
  password: z
    .string('Password must be string')
    .min(8, 'Password must be at least 8 characters long.')
    .regex(/^(?=.*[A-Z])/, 'Password must contain at least 1 uppercase letter.')
    .regex(
      /^(?=.*[!@#$%^&*])/,
      'Password must contain at least 1 special character.'
    )
    .regex(/^(?=.*\d)/, 'Password must contain at least 1 number.')
    .optional(),
  phone: z
    .string('Phone Number must be string')
    .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
      message:
        'Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX',
    })
    .optional(),
  role: z
    // enum ["ADMIN","USER","GUIDE","SUPER_ADMIN"]
    .enum(Object.values(Role) as [string])
    .optional(),
  isActive: z.enum(Object.values(IsActive) as [string]).optional(),
  isDeleted: z.boolean('isDeleted must be a boolean value').optional(),
  isVerified: z.boolean('isVerified must be a boolean value').optional(),
  address: z
    .string('Address must be string')
    .max(200, { message: 'Address cannot exceed 200 characters.' })
    .optional(),
});
