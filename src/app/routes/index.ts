import { Router } from 'express';
import { AuthRoutes } from '../modules/auth/auth.route';
import { UserRoutes } from '../modules/users/user.route';
import { DivisionRoutes } from '../modules/division/division.route';

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
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
