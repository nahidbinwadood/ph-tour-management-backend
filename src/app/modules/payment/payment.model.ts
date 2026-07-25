import { model, Schema } from 'mongoose';
import { IPayment, PAYMENT_STATUS } from './payment.interface';
import { schemaTransform } from '../users/user.model';

const paymentSchema = new Schema<IPayment>(
  {
    booking: {
      type: Schema.Types.ObjectId,
      ref: 'Booking',
      required: true,
    },
    transactionId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(PAYMENT_STATUS),
      default: PAYMENT_STATUS.UNPAID,
    },
    amount: {
      type: Number,
    },
    paymentGatewayData: {
      type: Schema.Types.Mixed,
    },
    invoiceUrl: {
      type: String,
    },
  },
  {
    versionKey: false,
    timestamps: true,
    toJSON: schemaTransform,
    toObject: schemaTransform,
  }
);

export const Payment = model<IPayment>('Payment', paymentSchema);
