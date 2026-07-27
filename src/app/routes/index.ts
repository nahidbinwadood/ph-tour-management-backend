import { Router } from 'express';
import { AuthRoutes } from '../modules/auth/auth.route';
import { BookingRoutes } from '../modules/booking/booking.route';
import { DivisionRoutes } from '../modules/division/division.route';
import { FileRoutes } from '../modules/file/file.route';
import { PaymentRoutes } from '../modules/payment/payment.route';
import { TourRoutes } from '../modules/tour/tour.route';
import { UserRoutes } from '../modules/users/user.route';

interface IModuleRoutes {
  path: string;
  route: Router;
}

const router = Router();

const moduleRoutes: IModuleRoutes[] = [
  {
    path: '/user',
    route: UserRoutes,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/division',
    route: DivisionRoutes,
  },
  {
    path: '/tour',
    route: TourRoutes,
  },
  {
    path: '/booking',
    route: BookingRoutes,
  },
  {
    path: '/payment',
    route: PaymentRoutes,
  },
  {
    path: '/file',
    route: FileRoutes,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
