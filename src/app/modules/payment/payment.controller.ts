import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { PaymentServices } from './payment.service';
import { envVars } from '../../config/env';
import AppError from '../../errorHelpers/AppError';
import httpStatus from 'http-status-codes';
import sendResponse from '../../utils/sendResponse';

// init payment==>
const initPayment = catchAsync(async (req: Request, res: Response) => {
  const bookingId = req.params.bookingId;

  if (!bookingId) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Booking id is missing');
  }

  const response = await PaymentServices.initPayment(bookingId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Payment initiated successfully',
    data: response,
  });
});

// success payment==>
const successPayment = catchAsync(async (req: Request, res: Response) => {
  const transactionId = req.query.transactionId;
  const amount = req.query.amount;
  const status = req.query.status;

  if (!transactionId) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Transaction id is missing');
  }

  const response = await PaymentServices.successPayment(
    transactionId as string
  );

  if (response.success) {
    res.redirect(
      `${envVars.SSL_SUCCESS_FRONTEND_URL}?transactionId=${transactionId}&message=${response.message}&amount=${amount}&status=${status}`
    );
  }
});

// failed payment==>
const failedPayment = catchAsync(async (req: Request, res: Response) => {
  const transactionId = req.query.transactionId;
  const amount = req.query.amount;
  const status = req.query.status;

  if (!transactionId) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Transaction id is missing');
  }

  const response = await PaymentServices.failedPayment(transactionId as string);

  if (response.success) {
    res.redirect(
      `${envVars.SSL_FAIL_FRONTEND_URL}?transactionId=${transactionId}&message=${response.message}&amount=${amount}&status=${status}`
    );
  }
});

// cancel payment==>
const cancelPayment = catchAsync(async (req: Request, res: Response) => {
  const transactionId = req.query.transactionId;
  const amount = req.query.amount;
  const status = req.query.status;

  if (!transactionId) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Transaction id is missing');
  }

  const response = await PaymentServices.cancelPayment(transactionId as string);

  if (response.success) {
    res.redirect(
      `${envVars.SSL_CANCEL_FRONTEND_URL}?transactionId=${transactionId}&message=${response.message}&amount=${amount}&status=${status}`
    );
  }
});

export const PaymentControllers = {
  initPayment,
  successPayment,
  failedPayment,
  cancelPayment,
};
