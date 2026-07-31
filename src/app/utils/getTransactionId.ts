import { randomBytes } from 'crypto';

export const getTransactionId = (userId: string) => {
  return `tran_${Date.now()}_${userId}_${randomBytes(16)}`;
};
