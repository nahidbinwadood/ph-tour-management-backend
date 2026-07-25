import { Router } from 'express';
import { PaymentControllers } from './payment.controller';

const router = Router();

// payment init==>
router.post('/init-payment/:bookingId', PaymentControllers.initPayment);

// success ==>
router.post('/success', PaymentControllers.successPayment);
// fail ==>
router.post('/fail', PaymentControllers.failedPayment);
// cancel ==>
router.post('/cancel', PaymentControllers.cancelPayment);

export const PaymentRoutes = router;
