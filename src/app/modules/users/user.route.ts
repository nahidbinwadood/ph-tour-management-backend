import { NextFunction, Request, Response, Router } from 'express';
import { UserControllers } from './user.controller';
import z from 'zod';
import validateRequest from '../../middlewares/validateRequest';
import { createUserSchema, loginUserSchema } from './user.schema';

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
userRoutes.get('/all-users', UserControllers.getAllUsers);

export { userRoutes };
