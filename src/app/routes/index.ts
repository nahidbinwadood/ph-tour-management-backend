import { Router } from 'express';
import { userRoutes } from '../modules/users/user.route';

interface IModuleRoutes {
  path: string;
  route: Router;
}

const router = Router();

const moduleRoutes: IModuleRoutes[] = [
  {
    path: '/user',
    route: userRoutes,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
