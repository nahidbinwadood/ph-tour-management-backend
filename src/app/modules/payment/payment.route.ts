import { Router } from 'express';
import { PaymentControllers } from './payment.controller';
import checkAuth from '../../middlewares/checkAuth';
import { Role } from '../users/user.interface';

const router = Router();

// payment init==>
router.post('/init-payment/:bookingId', PaymentControllers.initPayment);

// success ==>
router.post('/success', PaymentControllers.successPayment);
// fail ==>
router.post('/fail', PaymentControllers.failedPayment);
// cancel ==>
router.post('/cancel', PaymentControllers.cancelPayment);

// get all payments==>
router.get(
  '/get-all',
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  PaymentControllers.getAllPayments
);

export const PaymentRoutes = router;
