import { Router } from 'express';
import checkAuth from '../../middlewares/checkAuth';
import validateRequest from '../../middlewares/validateRequest';
import { Role } from '../users/user.interface';
import { DivisionControllers } from './division.controller';
import { createDivisionSchema } from './division.schema';

const router = Router();

// create division
router.post(
  '/create',
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(createDivisionSchema),
  DivisionControllers.createDivision
);

export const DivisionRoutes = router;
