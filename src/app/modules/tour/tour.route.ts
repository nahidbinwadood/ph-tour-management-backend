import { Router } from 'express';
import checkAuth from '../../middlewares/checkAuth';
import validateRequest from '../../middlewares/validateRequest';
import { Role } from '../users/user.interface';
import { TourControllers } from './tour.controller';
import {
  createTourSchema,
  tourTypeSchema,
  updateTourSchema,
} from './tour.schema';

const router = Router();

// ==============Tour Types===================
router.post(
  '/create-tour-type',
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(tourTypeSchema),
  TourControllers.createTourTypes
);
router.get('/tour-types', TourControllers.getAllTourTypes);
router.get('/tour-types/:id', TourControllers.getSingleTourType);

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

router.get('/', TourControllers.getAllTours);
router.get('/:slug', TourControllers.getSingleTour);

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
