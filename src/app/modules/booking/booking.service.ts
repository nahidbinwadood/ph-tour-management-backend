import AppError from '../../errorHelpers/AppError';
import { Tour } from '../tour/tour.model';
import { BOOKING_STATUS, IBooking } from './booking.interface';
import httpStatus from 'http-status-codes';
import { Booking } from './booking.model';
import { User } from '../users/user.model';
import { Payment } from '../payment/payment.model';
import { PAYMENT_STATUS } from '../payment/payment.interface';
import { SSLService } from '../../sslCommerz/sslCommerz.service';
import { QueryBuilder } from '../../utils/QueryBuilder';
import { getTransactionId } from '../../utils/getTransactionId';

// max total booking amount allowed (SSLCommerz / business cap)==>
const MAX_BOOKING_AMOUNT = 500000;

// create booking==>
const createBooking = async (payload: Partial<IBooking>, userId: string) => {
  const session = await Booking.startSession();
  session.startTransaction();

  try {
    const tour = payload.tour;

    const isTourExist = await Tour.findById(tour);

    // throw error if the tour doest not exist==>
    if (!isTourExist) {
      throw new AppError(httpStatus.NOT_FOUND, 'Tour not found');
    }

    const userData = await User.findById(userId);

    // throw error if the user do not have either phone number or address==>
    if (!userData?.phone || !userData?.address) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Please update your profile to book a tour'
      );
    }

    const amount = Number(isTourExist?.costFrom) * Number(payload?.guestCount);

    // throw error if the amount is greater than the max==>
    if (amount > MAX_BOOKING_AMOUNT) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Max amount reached !! Decrease your guest count to proceed with the booking'
      );
    }

    // create the booking for the user==>
    const bookingPayload = {
      user: userId,
      tour: payload?.tour,
      guestCount: payload?.guestCount,
      status: BOOKING_STATUS.PENDING,
    };

    const booking = await Booking.create([bookingPayload], {
      session,
    });

    // generate the transaction id and create a payment for this booking==>
    const transactionId = getTransactionId(userId);

    const paymentPayload = {
      booking: booking[0]?.id,
      transactionId,
      amount,
      status: PAYMENT_STATUS.UNPAID,
    };

    const payment = await Payment.create([paymentPayload], { session });

    // update the booking data and add the payment id==>

    const updatedBookingData = await Booking.findByIdAndUpdate(
      booking[0]?.id,
      {
        payment: payment[0]?.id,
      },
      {
        new: true,
        runValidators: true,
        session,
      }
    )
      .populate('user', 'name email address phone role')
      .populate('payment', 'transactionId status amount');

    // initiate the payment==>
    const sslPayment = await SSLService.sslPaymentInit({
      transactionId,
      amount,
      name: userData?.name,
      email: userData?.email,
      phoneNumber: userData?.phone,
      address: userData?.address,
    });

    // throw error if there is no gateway url==>
    if (!sslPayment.GatewayPageURL) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to proceed payment');
    }

    // commit the session==>
    await session.commitTransaction();
    session.endSession();

    return {
      paymentUrl: sslPayment?.GatewayPageURL,
      booking: updatedBookingData,
    };
  } catch (error) {
    console.log(error);
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

// get all bookings==>
const getAllBookings = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(
    Booking.find()
      .populate('user', 'name email role phone address')
      .populate('tour', 'title description location costFrom maxGuest'),
    query
  );

  const bookings = queryBuilder.filter().sort().fields().paginate();

  const [data, meta] = await Promise.all([
    bookings.build(),
    queryBuilder.getMeta(),
  ]);

  return {
    data,
    meta,
  };
};

// get my bookings==>
const getMyBookings = async (userId: string, query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(
    Booking.find({ user: userId })
      .populate('user', 'name email role phone address')
      .populate('tour', 'title description location costFrom maxGuest'),
    query
  );

  const tour = queryBuilder.filter().sort().fields().paginate();

  const [data, meta] = await Promise.all([
    tour.build(),
    queryBuilder.getMeta(),
  ]);

  return { data, meta };
};

// get single booking==>
const getSingleBooking = async (bookingId: string) => {
  const response = await Booking.findById(bookingId)
    .populate('user', 'name email role phone address')
    .populate('tour', 'title description location costFrom maxGuest');

  // throw error if the booking not found==>
  if (!response) {
    throw new AppError(httpStatus.NOT_FOUND, 'Booking not found');
  }
  return response;
};

// get single booking==>
const updateBookingStatus = async (
  bookingId: string,
  payload: Partial<IBooking>
) => {
  const response = await Booking.findByIdAndUpdate(
    bookingId,
    {
      status: payload.status,
    },
    {
      new: true,
      runValidators: true,
    }
  )
    .populate('user', 'name email role phone address')
    .populate('tour', 'title description location costFrom maxGuest');
  // throw error if the booking not found==>
  if (!response) {
    throw new AppError(httpStatus.NOT_FOUND, 'Booking not found');
  }
  return response;
};

export const BookingServices = {
  createBooking,
  getAllBookings,
  getMyBookings,
  getSingleBooking,
  updateBookingStatus,
};
