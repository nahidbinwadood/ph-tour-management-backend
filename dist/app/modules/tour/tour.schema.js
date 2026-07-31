"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTourSchema = exports.createTourSchema = exports.tourTypeSchema = void 0;
const mongoose_1 = require("mongoose");
const zod_1 = __importDefault(require("zod"));
const objectId = zod_1.default
    .string()
    .min(1, 'Id is required')
    .refine((val) => mongoose_1.Types.ObjectId.isValid(val), {
    message: 'Invalid ID. Please provide a valid MongoDB ObjectId',
});
exports.tourTypeSchema = zod_1.default.object({
    name: zod_1.default
        .string()
        .min(1, 'Tour type is required')
        .max(100, 'Tour type cannot exceed 100 characters'),
});
exports.createTourSchema = zod_1.default.object({
    title: zod_1.default
        .string()
        .min(1, 'Tour title is required')
        .max(100, 'Tour title cannot exceed 100 characters'),
    description: zod_1.default
        .string()
        .max(200, 'Tour description cannot exceed 200 characters')
        .optional(),
    images: zod_1.default.array(zod_1.default.string().min(1, 'Tour Image is required')).optional(),
    location: zod_1.default
        .string()
        .max(100, 'Tour Location cannot exceed 100 characters')
        .optional(),
    costFrom: zod_1.default.coerce.number({ message: 'Cost from is required' }).optional(),
    startDate: zod_1.default.coerce.date({ message: 'Start Date is required' }).optional(),
    endDate: zod_1.default.coerce.date({ message: 'End Date is required' }).optional(),
    included: zod_1.default.array(zod_1.default.string().min(1, 'Tour Include is required')).optional(),
    departureLocation: zod_1.default
        .string()
        .max(100, 'Departure location cannot exceed 100 characters')
        .optional(),
    arrivalLocation: zod_1.default
        .string()
        .max(100, 'Arrival location cannot exceed 100 characters')
        .optional(),
    excluded: zod_1.default.array(zod_1.default.string().min(1, 'Tour Exclude is required')).optional(),
    amenities: zod_1.default
        .array(zod_1.default.string().min(1, 'Tour Amenities is required'))
        .optional(),
    tourPlan: zod_1.default.array(zod_1.default.string().min(1, 'Tour Plan is required')).optional(),
    maxGuest: zod_1.default.coerce.number({ message: 'Max guest is required' }).optional(),
    minAge: zod_1.default.coerce.number({ message: 'Min Age is required' }).optional(),
    division: objectId,
    tourType: objectId,
});
exports.updateTourSchema = zod_1.default.object({
    title: zod_1.default
        .string()
        .min(1, 'Tour title is required')
        .max(100, 'Tour title cannot exceed 100 characters')
        .optional(),
    description: zod_1.default
        .string()
        .max(200, 'Tour description cannot exceed 200 characters')
        .optional(),
    images: zod_1.default.array(zod_1.default.string().min(1, 'Tour Image is required')).optional(),
    location: zod_1.default
        .string()
        .max(100, 'Tour Location cannot exceed 100 characters')
        .optional(),
    costFrom: zod_1.default.coerce.number({ message: 'Cost from is required' }).optional(),
    startDate: zod_1.default.date({ message: 'Start Date is required' }).optional(),
    endDate: zod_1.default.date({ message: 'End Date is required' }).optional(),
    departureLocation: zod_1.default
        .string()
        .max(100, 'Departure location cannot exceed 100 characters')
        .optional(),
    arrivalLocation: zod_1.default
        .string()
        .max(100, 'Arrival location cannot exceed 100 characters')
        .optional(),
    included: zod_1.default.array(zod_1.default.string().min(1, 'Tour Include is required')).optional(),
    excluded: zod_1.default.array(zod_1.default.string().min(1, 'Tour Exclude is required')).optional(),
    amenities: zod_1.default
        .array(zod_1.default.string().min(1, 'Tour Amenities is required'))
        .optional(),
    tourPlan: zod_1.default.array(zod_1.default.string().min(1, 'Tour Plan is required')).optional(),
    maxGuest: zod_1.default.coerce.number({ message: 'Max guest is required' }).optional(),
    minAge: zod_1.default.coerce.number({ message: 'Min Age is required' }).optional(),
    division: objectId.optional(),
    tourType: objectId.optional(),
    deletedFiles: zod_1.default.array(zod_1.default.string()).optional(),
});
