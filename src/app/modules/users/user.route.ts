import { NextFunction, Request, Response, Router } from 'express';
import { UserControllers } from './user.controller';
import z from 'zod';
import validateRequest from '../../middlewares/validateRequest';
import { createUserSchema } from './user.schema';

const userRoutes = Router();

userRoutes.post(
  '/register',
  validateRequest(createUserSchema),
  UserControllers.createUser
);
userRoutes.get('/all-users', UserControllers.getAllUsers);

export { userRoutes };
