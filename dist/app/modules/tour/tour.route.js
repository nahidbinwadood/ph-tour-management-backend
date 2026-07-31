"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TourRoutes = void 0;
const express_1 = require("express");
const checkAuth_1 = __importDefault(require("../../middlewares/checkAuth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const user_interface_1 = require("../users/user.interface");
const tour_controller_1 = require("./tour.controller");
const tour_schema_1 = require("./tour.schema");
const multer_config_1 = require("../../config/multer.config");
const router = (0, express_1.Router)();
// ==============Tour Types===================
router.post('/create-tour-type', (0, checkAuth_1.default)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), (0, validateRequest_1.default)(tour_schema_1.tourTypeSchema), tour_controller_1.TourControllers.createTourTypes);
router.get('/tour-types', tour_controller_1.TourControllers.getAllTourTypes);
router.get('/tour-types/:id', tour_controller_1.TourControllers.getSingleTourType);
router.patch('/tour-types/:id', (0, checkAuth_1.default)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), (0, validateRequest_1.default)(tour_schema_1.tourTypeSchema), tour_controller_1.TourControllers.updateTourTypes);
router.delete('/tour-types/:id', (0, checkAuth_1.default)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), tour_controller_1.TourControllers.deleteTourTypes);
// ==============Tour ===================
router.post('/create', (0, checkAuth_1.default)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), multer_config_1.multerUpload.array('files'), (0, validateRequest_1.default)(tour_schema_1.createTourSchema), tour_controller_1.TourControllers.createTour);
router.get('/', tour_controller_1.TourControllers.getAllTours);
router.get('/:slug', tour_controller_1.TourControllers.getSingleTour);
router.patch('/:id', (0, checkAuth_1.default)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), multer_config_1.multerUpload.array('files'), (0, validateRequest_1.default)(tour_schema_1.updateTourSchema), tour_controller_1.TourControllers.updateTour);
router.delete('/:id', (0, checkAuth_1.default)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), tour_controller_1.TourControllers.deleteTour);
exports.TourRoutes = router;
