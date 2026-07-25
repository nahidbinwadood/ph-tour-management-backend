import { Router } from 'express';
import checkAuth from '../../middlewares/checkAuth';
import { Role } from '../users/user.interface';
import { BookingControllers } from './booking.controller';
import validateRequest from '../../middlewares/validateRequest';
import { createBookingSchema, updateBookingSchema } from './booking.schema';

const router = Router();

// create booking==>
router.post(
  '/',
  checkAuth(...Object.values(Role)),
  validateRequest(createBookingSchema),
  BookingControllers.createBooking
);

// get all bookings==>
router.get(
  '/',
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  BookingControllers.getAllBookings
);

// get my bookings==>
router.get(
  '/my-bookings',
  checkAuth(...Object.values(Role)),
  BookingControllers.getMyBookings
);

// get single booking==>
router.get(
  '/:bookingId',
  checkAuth(...Object.values(Role)),
  BookingControllers.getSingleBooking
);

// update booking status==>
router.patch(
  '/:bookingId/status',
  checkAuth(...Object.values(Role)),
  validateRequest(updateBookingSchema),
  BookingControllers.updateBookingStatus
);

export const BookingRoutes = router;
