import { Types } from 'mongoose';
import z from 'zod';

const objectId = z
  .string()
  .min(1, 'Id is required')
  .refine((val) => Types.ObjectId.isValid(val), {
    message: 'Invalid ID. Please provide a valid MongoDB ObjectId',
  });

export const tourTypeSchema = z.object({
  name: z
    .string()
    .min(1, 'Tour type is required')
    .max(100, 'Tour type cannot exceed 100 characters'),
});

export const createTourSchema = z.object({
  title: z
    .string()
    .min(1, 'Tour title is required')
    .max(100, 'Tour title cannot exceed 100 characters'),
  description: z
    .string()
    .max(200, 'Tour description cannot exceed 200 characters')
    .optional(),
  images: z.array(z.string().min(1, 'Tour Image is required')).optional(),
  location: z
    .string()
    .max(100, 'Tour Location cannot exceed 100 characters')
    .optional(),
  costFrom: z.coerce.number({ message: 'Cost from is required' }).optional(),
  startDate: z.coerce.date({ message: 'Start Date is required' }).optional(),
  endDate: z.coerce.date({ message: 'End Date is required' }).optional(),
  included: z.array(z.string().min(1, 'Tour Include is required')).optional(),
  departureLocation: z
    .string()
    .max(100, 'Departure location cannot exceed 100 characters')
    .optional(),
  arrivalLocation: z
    .string()
    .max(100, 'Arrival location cannot exceed 100 characters')
    .optional(),
  excluded: z.array(z.string().min(1, 'Tour Exclude is required')).optional(),
  amenities: z
    .array(z.string().min(1, 'Tour Amenities is required'))
    .optional(),
  tourPlan: z.array(z.string().min(1, 'Tour Plan is required')).optional(),
  maxGuest: z.coerce.number({ message: 'Max guest is required' }).optional(),
  minAge: z.coerce.number({ message: 'Min Age is required' }).optional(),
  division: objectId,
  tourType: objectId,
});

export const updateTourSchema = z.object({
  title: z
    .string()
    .min(1, 'Tour title is required')
    .max(100, 'Tour title cannot exceed 100 characters')
    .optional(),
  description: z
    .string()
    .max(200, 'Tour description cannot exceed 200 characters')
    .optional(),
  images: z.array(z.string().min(1, 'Tour Image is required')).optional(),
  location: z
    .string()
    .max(100, 'Tour Location cannot exceed 100 characters')
    .optional(),
  costFrom: z.coerce.number({ message: 'Cost from is required' }).optional(),
  startDate: z.date({ message: 'Start Date is required' }).optional(),
  endDate: z.date({ message: 'End Date is required' }).optional(),
  departureLocation: z
    .string()
    .max(100, 'Departure location cannot exceed 100 characters')
    .optional(),
  arrivalLocation: z
    .string()
    .max(100, 'Arrival location cannot exceed 100 characters')
    .optional(),
  included: z.array(z.string().min(1, 'Tour Include is required')).optional(),
  excluded: z.array(z.string().min(1, 'Tour Exclude is required')).optional(),
  amenities: z
    .array(z.string().min(1, 'Tour Amenities is required'))
    .optional(),
  tourPlan: z.array(z.string().min(1, 'Tour Plan is required')).optional(),
  maxGuest: z.coerce.number({ message: 'Max guest is required' }).optional(),
  minAge: z.coerce.number({ message: 'Min Age is required' }).optional(),
  division: objectId.optional(),
  tourType: objectId.optional(),
  deletedFiles: z.string().optional(),
});
