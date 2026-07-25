import { Router } from 'express';
import { PaymentControllers } from './payment.controller';

const router = Router();

// success ==>
router.post('/success', PaymentControllers.paymentSuccess);

export const PaymentRoutes = router;
