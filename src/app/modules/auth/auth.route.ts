import { NextFunction, Request, Response, Router } from 'express';
import { AuthControllers } from './auth.controller';
import validateRequest from '../../middlewares/validateRequest';
import {
  changePasswordSchema,
  createUserSchema,
  forgetPasswordSchema,
  loginSchema,
  resendOtpSchema,
  resetPasswordSchema,
  setPasswordSchema,
  verifyOtpSchema,
} from './auth.schema';
import checkAuth from '../../middlewares/checkAuth';
import { Role } from '../users/user.interface';
import passport from 'passport';
import { envVars } from '../../config/env';

const router = Router();

// create user==>
router.post(
  '/register',
  validateRequest(createUserSchema),
  AuthControllers.createUser
);

// verify otp==>
router.post(
  '/verify-otp',
  validateRequest(verifyOtpSchema),
  AuthControllers.verifyOtp
);

// resend otp==>
router.post(
  '/resend-otp',
  validateRequest(resendOtpSchema),
  AuthControllers.resendOtp
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

// set password==>
router.post(
  '/set-password',
  checkAuth(...Object.values(Role)),
  validateRequest(setPasswordSchema),
  AuthControllers.setPassword
);

// forget password==>
router.post(
  '/forget-password',
  validateRequest(forgetPasswordSchema),
  AuthControllers.forgetPassword
);

// reset password==>
router.post(
  '/reset-password',
  validateRequest(resetPasswordSchema),
  checkAuth(...Object.values(Role)),
  AuthControllers.resetPassword
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
  passport.authenticate('google', {
    failureRedirect: `${envVars.FRONTEND_URL}/login?error=Something_went_wrong.Please_contact_support`,
  }),
  AuthControllers.googleCallback
);

export const AuthRoutes = router;
