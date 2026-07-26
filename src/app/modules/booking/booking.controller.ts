import { Request, Response } from 'express';
import httpStatus from 'http-status-codes';
import { JwtPayload } from 'jsonwebtoken';
import AppError from '../../errorHelpers/AppError';
import { catchAsync } from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { BookingServices } from './booking.service';

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
const getAllBookings = catchAsync(async (req: Request, res: Response) => {
  const response = await BookingServices.getAllBookings(
    req.query as Record<string, string>
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Bookings data fetched successfully',
    data: response,
  });
});

// get my bookings==>
const getMyBookings = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user as JwtPayload;
  const response = await BookingServices.getMyBookings(
    userId,
    req.query as Record<string, string>
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Bookings data fetched successfully',
    data: response,
  });
});

// get single booking==>
const getSingleBooking = catchAsync(async (req: Request, res: Response) => {
  const bookingId = req.params.bookingId;

  // throw error if the booking id is missing==>
  if (!bookingId) {
    throw new AppError(httpStatus.NOT_FOUND, 'Booking id missing');
  }

  const response = await BookingServices.getSingleBooking(bookingId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Booking data fetched successfully',
    data: response,
  });
});

// get single booking==>
const updateBookingStatus = catchAsync(async (req: Request, res: Response) => {
  const bookingId = req.params.bookingId;

  // throw error if the booking id is missing==>
  if (!bookingId) {
    throw new AppError(httpStatus.NOT_FOUND, 'Booking id missing');
  }

  const response = await BookingServices.updateBookingStatus(
    bookingId,
    req.body
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Booking data updated successfully',
    data: response,
  });
});

export const BookingControllers = {
  createBooking,
  getAllBookings,
  getMyBookings,
  getSingleBooking,
  updateBookingStatus,
};
