import { Router } from 'express';
import checkAuth from '../../middlewares/checkAuth';
import validateRequest from '../../middlewares/validateRequest';
import { Role } from '../users/user.interface';
import { DivisionControllers } from './division.controller';
import { createDivisionSchema, updateDivisionSchema } from './division.schema';
import { multerUpload } from '../../config/multer.config';

const router = Router();

// create division
router.post(
  '/create',
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  multerUpload.single('file'),
  validateRequest(createDivisionSchema),
  DivisionControllers.createDivision
);

// get all division==>
router.get('/', DivisionControllers.getAllDivisions);

// get single division==>
router.get('/:slug', DivisionControllers.getSingleDivision);

// update division==>
router.patch(
  '/:id',
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  multerUpload.single('file'),
  validateRequest(updateDivisionSchema),
  DivisionControllers.updateDivision
);

// delete division==>
router.delete(
  '/:id',
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  DivisionControllers.deleteDivision
);

export const DivisionRoutes = router;
