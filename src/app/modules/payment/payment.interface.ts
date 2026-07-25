/* eslint-disable @typescript-eslint/no-explicit-any */
import { Types } from 'mongoose';

export enum PAYMENT_STATUS {
  UNPAID = 'UNPAID',
  PAID = 'PAID',
  CANCELLED = 'CANCELLED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

export interface IPayment {
  booking: Types.ObjectId;
  transactionId: string;
  amount: number;
  paymentGatewayData?: any;
  invoiceUrl?: string;
  status: PAYMENT_STATUS;
}
