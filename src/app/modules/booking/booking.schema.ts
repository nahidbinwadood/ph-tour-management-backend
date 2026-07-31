import z from 'zod';
import { BOOKING_STATUS } from './booking.interface';

export const createBookingSchema = z.object({
  tour: z.string().min(1, 'Tour is required'),
  guestCount: z.coerce
    .number('Guest count must be a number')
    .min(1, 'Guest count is required'),
});

const bookingStatusValues = Object.values(BOOKING_STATUS) as [string, ...string[]];

export const updateBookingSchema = z.object({
  status: z.enum(
    bookingStatusValues,
    `Status must be one of ${bookingStatusValues.join(', ')}`,
  ),
});
