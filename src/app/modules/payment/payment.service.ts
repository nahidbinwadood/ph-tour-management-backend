/* eslint-disable @typescript-eslint/no-explicit-any */
import AppError from '../../errorHelpers/AppError';
import { SSLService } from '../../sslCommerz/sslCommerz.service';
import { BOOKING_STATUS } from '../booking/booking.interface';
import { Booking } from '../booking/booking.model';
import { PAYMENT_STATUS } from './payment.interface';
import { Payment } from './payment.model';
import httpStatus from 'http-status-codes';

// init payment==>
const initPayment = async (bookingId: string) => {
  const booking = await Booking.findById(bookingId);

  if (!booking) {
    throw new AppError(httpStatus.NOT_FOUND, 'Booking not found');
  }

  const payment = await Payment.findById(booking?.payment);

  if (!payment) {
    throw new AppError(httpStatus.NOT_FOUND, 'Payment not found');
  }

  const sslPayload = {
    amount: payment?.amount,
    transactionId: payment?.transactionId,
    name: (booking.user as any)?.name,
    email: (booking.user as any)?.email,
    phoneNumber: (booking.user as any)?.phone,
    address: (booking.user as any)?.address,
  };

  const sslPayment = await SSLService.sslPaymentInit(sslPayload);

  return {
    paymentUrl: sslPayment?.GatewayPageURL,
  };
};

// success payment==>
const successPayment = async (transactionId: string) => {
  const session = await Payment.startSession();

  session.startTransaction();

  try {
    const payment = await Payment.findOne({ transactionId });

    // throw error if payment not found==>
    if (!payment) {
      throw new AppError(httpStatus.NOT_FOUND, 'Payment not found');
    }

    // update the payment status ==>
    await Payment.findByIdAndUpdate(
      payment?.id,
      { status: PAYMENT_STATUS.PAID },
      { new: true, runValidators: true, session }
    );

    // update the booking status ==>
    await Booking.findByIdAndUpdate(
      payment.booking,
      {
        status: BOOKING_STATUS.COMPLETE,
      },
      {
        new: true,
        runValidators: true,
        session,
      }
    )
      .populate('user', 'name email address phone role')
      .populate('payment', 'transactionId status amount');

    await session.commitTransaction();
    session.endSession();

    return {
      success: true,
      message: 'Payment completed successfully',
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

// failed payment==>
const failedPayment = async (transactionId: string) => {
  const session = await Payment.startSession();

  session.startTransaction();

  try {
    const payment = await Payment.findOne({ transactionId });

    // throw error if payment not found==>
    if (!payment) {
      throw new AppError(httpStatus.NOT_FOUND, 'Payment not found');
    }

    // update the payment status ==>
    await Payment.findByIdAndUpdate(
      payment?.id,
      { status: PAYMENT_STATUS.FAILED },
      { new: true, runValidators: true, session }
    );

    // update the booking status ==>
    await Booking.findByIdAndUpdate(
      payment.booking,
      {
        status: BOOKING_STATUS.FAILED,
      },
      {
        new: true,
        runValidators: true,
        session,
      }
    )
      .populate('user', 'name email address phone role')
      .populate('payment', 'transactionId status amount');

    await session.commitTransaction();
    session.endSession();

    return {
      success: true,
      message: 'Payment completed successfully',
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

// cancel payment==>
const cancelPayment = async (transactionId: string) => {
  const session = await Payment.startSession();

  session.startTransaction();

  try {
    const payment = await Payment.findOne({ transactionId });

    // throw error if payment not found==>
    if (!payment) {
      throw new AppError(httpStatus.NOT_FOUND, 'Payment not found');
    }

    // update the payment status ==>
    await Payment.findByIdAndUpdate(
      payment?.id,
      { status: PAYMENT_STATUS.CANCELLED },
      { new: true, runValidators: true, session }
    );

    // update the booking status ==>
    await Booking.findByIdAndUpdate(
      payment.booking,
      {
        status: BOOKING_STATUS.CANCEL,
      },
      {
        new: true,
        runValidators: true,
        session,
      }
    )
      .populate('user', 'name email address phone role')
      .populate('payment', 'transactionId status amount');

    await session.commitTransaction();
    session.endSession();

    return {
      success: true,
      message: 'Payment completed successfully',
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const PaymentServices = {
  initPayment,
  successPayment,
  failedPayment,
  cancelPayment,
};
