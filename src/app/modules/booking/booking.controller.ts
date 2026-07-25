import { NextFunction, Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { JwtPayload } from 'jsonwebtoken';
import { BookingServices } from './booking.service';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status-codes';

// create booking==>
const createBooking = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user as JwtPayload;
  const result = await BookingServices.createBooking(req.body, userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Booking created successfully',
    data: result,
  });
});

// get all bookings==>
const getAllBookings = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {}
);

// get my bookings==>
const getMyBookings = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {}
);

// get single booking==>
const getSingleBooking = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {}
);

// get single booking==>
const updateBookingStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {}
);

export const BookingControllers = {
  createBooking,
  getAllBookings,
  getMyBookings,
  getSingleBooking,
  updateBookingStatus,
};
