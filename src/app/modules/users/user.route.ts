import { NextFunction, Request, Response, Router } from 'express';
import { UserControllers } from './user.controller';
import validateRequest from '../../middlewares/validateRequest';
import {
  createUserSchema,
  loginUserSchema,
  updateUserSchema,
} from './user.schema';
import AppError from '../../errorHelpers/AppError';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { envVars } from '../../config/env';
import { Role } from './user.interface';
import checkAuth from '../../middlewares/checkAuth';

const userRoutes = Router();

// create user==>
userRoutes.post(
  '/register',
  validateRequest(createUserSchema),
  UserControllers.createUser
);

// login==>
userRoutes.post(
  '/login',
  validateRequest(loginUserSchema),
  UserControllers.loginUser
);

// get all the users==>
userRoutes.get(
  '/all-users',
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  UserControllers.getAllUsers
);

// update user==>
userRoutes.patch(
  '/:id',
  validateRequest(updateUserSchema),
  checkAuth(...Object.values(Role)),
  UserControllers.updateUser
);

// delete user==>
userRoutes.delete('/:id', UserControllers.deleteUser);

export { userRoutes };
