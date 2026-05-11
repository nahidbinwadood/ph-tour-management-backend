import { Router } from 'express';
import { AuthControllers } from './auth.controller';
import validateRequest from '../../middlewares/validateRequest';
import {
  changePasswordSchema,
  createUserSchema,
  loginSchema,
} from './auth.schema';
import checkAuth from '../../middlewares/checkAuth';
import { Role } from '../users/user.interface';

const router = Router();

// create user==>
router.post(
  '/register',
  validateRequest(createUserSchema),
  AuthControllers.createUser
);

// credentials login==>
router.post(
  '/login',
  validateRequest(loginSchema),
  AuthControllers.credentialsLogin
);

// get refresh token==>
router.post('/refresh-token', AuthControllers.getNewAccessToken);

// logout==>
router.post('/logout', AuthControllers.logout);

// reset password==>
router.post(
  '/reset-password',
  validateRequest(changePasswordSchema),
  checkAuth(...Object.values(Role)),
  AuthControllers.resetPassword
);

export const AuthRoutes = router;
