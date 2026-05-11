"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePasswordSchema = exports.loginSchema = exports.createUserSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.createUserSchema = zod_1.default.object({
    name: zod_1.default
        .string({ message: 'Name is require' })
        .min(2, 'Name must be at least 2 characters long')
        .max(50, 'Name cannot exceed 50 characters'),
    email: zod_1.default
        .email({ message: 'Enter a valid email' })
        .min(5, 'Email must be at least 5 characters long'),
    password: zod_1.default
        .string('Password must be a string')
        .min(8, 'Password must be 8 characters long')
        .regex(/^(?=.*[A-Z])/, 'Password must contain at least 1 uppercase letter')
        .regex(/^(?=.*[!@#$%^&*])/, 'Password must contain at least 1 special character.')
        .regex(/^(?=.*\d)/, 'Password must contain at least 1 number.'),
    phone: zod_1.default
        .string('Phone number must be string')
        .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
        message: 'Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX',
    })
        .optional(),
    address: zod_1.default
        .string('Address must be string')
        .max(200, { message: 'Address cannot exceed 200 characters.' })
        .optional(),
});
exports.loginSchema = zod_1.default.object({
    email: zod_1.default
        .email({ message: 'Enter a valid email' })
        .min(5, 'Email must be at least 5 characters long'),
    password: zod_1.default
        .string('Password must be a string')
        .min(8, 'Password must be 8 characters long')
        .regex(/^(?=.*[A-Z])/, 'Password must contain at least 1 uppercase letter')
        .regex(/^(?=.*\d)/, 'Password must contain at least 1 number.'),
});
exports.changePasswordSchema = zod_1.default.object({
    oldPassword: zod_1.default
        .string('Old Password must be a string')
        .min(8, 'Old Password must be 8 characters long')
        .regex(/^(?=.*[A-Z])/, 'Old Password must contain at least 1 uppercase letter')
        .regex(/^(?=.*\d)/, 'Old Password must contain at least 1 number.'),
    newPassword: zod_1.default
        .string('New Password must be a string')
        .min(8, 'New Password must be 8 characters long')
        .regex(/^(?=.*[A-Z])/, 'New Password must contain at least 1 uppercase letter')
        .regex(/^(?=.*[!@#$%^&*])/, 'New Password must contain at least 1 special character.')
        .regex(/^(?=.*\d)/, 'New Password must contain at least 1 number.'),
});
