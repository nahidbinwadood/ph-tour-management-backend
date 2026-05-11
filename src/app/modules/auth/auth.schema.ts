import z from 'zod';

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

export const loginSchema = z.object({
  email: z
    .email({ message: 'Enter a valid email' })
    .min(5, 'Email must be at least 5 characters long'),
  password: z
    .string('Password must be a string')
    .min(8, 'Password must be 8 characters long')
    .regex(/^(?=.*[A-Z])/, 'Password must contain at least 1 uppercase letter')
    .regex(/^(?=.*\d)/, 'Password must contain at least 1 number.'),
});

export const changePasswordSchema = z.object({
  oldPassword: z
    .string('Old Password must be a string')
    .min(8, 'Old Password must be 8 characters long')
    .regex(
      /^(?=.*[A-Z])/,
      'Old Password must contain at least 1 uppercase letter'
    )
    .regex(/^(?=.*\d)/, 'Old Password must contain at least 1 number.'),

  newPassword: z
    .string('New Password must be a string')
    .min(8, 'New Password must be 8 characters long')
    .regex(
      /^(?=.*[A-Z])/,
      'New Password must contain at least 1 uppercase letter'
    )
    .regex(
      /^(?=.*[!@#$%^&*])/,
      'New Password must contain at least 1 special character.'
    )
    .regex(/^(?=.*\d)/, 'New Password must contain at least 1 number.'),
});
