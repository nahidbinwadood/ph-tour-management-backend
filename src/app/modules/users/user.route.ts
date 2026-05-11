import { Router } from 'express';
import checkAuth from '../../middlewares/checkAuth';
import validateRequest from '../../middlewares/validateRequest';
import { UserControllers } from './user.controller';
import { Role } from './user.interface';
import { updateUserSchema } from './user.schema';

const router = Router();

// get all the users==>
router.get(
  '/all-users',
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  UserControllers.getAllUsers
);

// update user==>
router.patch(
  '/:id',
  validateRequest(updateUserSchema),
  checkAuth(...Object.values(Role)),
  UserControllers.updateUser
);

// delete user==>
router.delete('/:id', UserControllers.deleteUser);

export const UserRoutes = router;
