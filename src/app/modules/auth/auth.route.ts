import { NextFunction, Request, Response, Router } from 'express';
import { AuthControllers } from './auth.controller';
import validateRequest from '../../middlewares/validateRequest';
import {
  changePasswordSchema,
  createUserSchema,
  loginSchema,
  setPasswordSchema,
} from './auth.schema';
import checkAuth from '../../middlewares/checkAuth';
import { Role } from '../users/user.interface';
import passport from 'passport';

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

// change password==>
router.post(
  '/change-password',
  checkAuth(...Object.values(Role)),
  validateRequest(changePasswordSchema),
  AuthControllers.changePassword
);

// reset password==>
router.post(
  '/reset-password',
  validateRequest(changePasswordSchema),
  checkAuth(...Object.values(Role)),
  AuthControllers.resetPassword
);

// set password==>
router.post(
  '/set-password',
  checkAuth(...Object.values(Role)),
  validateRequest(setPasswordSchema),
  AuthControllers.setPassword
);

// google verify==>
router.get('/google', (req: Request, res: Response, next: NextFunction) => {
  const redirect = req.query?.redirect || '';
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    state: redirect as string,
  })(req, res, next);
});

// google redirect==>
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  AuthControllers.googleCallback
);

export const AuthRoutes = router;
