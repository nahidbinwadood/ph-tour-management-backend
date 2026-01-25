"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserSchema = exports.loginUserSchema = exports.createUserSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const user_interface_1 = require("./user.interface");
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
exports.loginUserSchema = zod_1.default.object({
    email: zod_1.default.email({ message: 'Enter a valid email' }),
    password: zod_1.default.string().min(1, 'Password is required'),
});
exports.updateUserSchema = zod_1.default.object({
    name: zod_1.default
        .string('Name must be string')
        .min(2, { message: 'Name must be at least 2 characters long.' })
        .max(50, { message: 'Name cannot exceed 50 characters.' })
        .optional(),
    password: zod_1.default
        .string('Password must be string')
        .min(8, 'Password must be at least 8 characters long.')
        .regex(/^(?=.*[A-Z])/, 'Password must contain at least 1 uppercase letter.')
        .regex(/^(?=.*[!@#$%^&*])/, 'Password must contain at least 1 special character.')
        .regex(/^(?=.*\d)/, 'Password must contain at least 1 number.')
        .optional(),
    phone: zod_1.default
        .string('Phone Number must be string')
        .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
        message: 'Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX',
    })
        .optional(),
    role: zod_1.default
        // enum ["ADMIN","USER","GUIDE","SUPER_ADMIN"]
        .enum(Object.values(user_interface_1.Role))
        .optional(),
    isActive: zod_1.default.enum(Object.values(user_interface_1.IsActive)).optional(),
    isDeleted: zod_1.default.boolean('isDeleted must be a boolean value').optional(),
    isVerified: zod_1.default.boolean('isVerified must be a boolean value').optional(),
    address: zod_1.default
        .string('Address must be string')
        .max(200, { message: 'Address cannot exceed 200 characters.' })
        .optional(),
});
