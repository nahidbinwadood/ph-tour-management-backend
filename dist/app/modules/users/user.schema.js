"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.createUserSchema = zod_1.default.object({
    name: zod_1.default.string({ message: 'Name is require' }).min(1, 'Name is required'),
    email: zod_1.default.email({ message: 'Enter a valid email' }),
    password: zod_1.default.string().min(1, 'Password is required'),
    phone: zod_1.default.string().min(1, 'Phone is required'),
    isDeleted: zod_1.default.boolean().optional(),
    picture: zod_1.default.string().optional(),
});
