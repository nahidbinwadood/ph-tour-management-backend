import { Router } from 'express';
import checkAuth from '../../middlewares/checkAuth';
import { Role } from '../users/user.interface';
import validateRequest from '../../middlewares/validateRequest';
import {
  createTourSchema,
  tourTypeSchema,
  updateTourSchema,
} from './tour.schema';
import { TourControllers } from './tour.controller';

const router = Router();

// ==============Tour Types===================
router.post(
  '/create-tour-type',
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(tourTypeSchema),
  TourControllers.createTourTypes
);
router.get(
  '/tour-types',
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  TourControllers.getAllTourTypes
);

router.patch(
  '/tour-types/:id',
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(tourTypeSchema),
  TourControllers.updateTourTypes
);
router.delete(
  '/tour-types/:id',
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  TourControllers.deleteTourTypes
);

// ==============Tour ===================

router.post(
  '/create',
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(createTourSchema),
  TourControllers.createTour
);

router.get(
  '/',
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  TourControllers.getAllTours
);

router.patch(
  '/:id',
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(updateTourSchema),
  TourControllers.updateTour
);

router.delete(
  '/:id',
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  TourControllers.deleteTour
);

export const TourRoutes = router;
