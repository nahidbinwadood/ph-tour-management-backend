import { Router } from 'express';
import { AuthControllers } from './auth.controller';
import validateRequest from '../../middlewares/validateRequest';
import { createUserSchema, loginSchema } from './auth.schema';

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

export const AuthRoutes = router;
