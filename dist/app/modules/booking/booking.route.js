"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingRoutes = void 0;
const express_1 = require("express");
const checkAuth_1 = __importDefault(require("../../middlewares/checkAuth"));
const user_interface_1 = require("../users/user.interface");
const booking_controller_1 = require("./booking.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const booking_schema_1 = require("./booking.schema");
const router = (0, express_1.Router)();
// create booking==>
router.post('/', (0, checkAuth_1.default)(...Object.values(user_interface_1.Role)), (0, validateRequest_1.default)(booking_schema_1.createBookingSchema), booking_controller_1.BookingControllers.createBooking);
// get all bookings==>
router.get('/', (0, checkAuth_1.default)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), booking_controller_1.BookingControllers.getAllBookings);
// get my bookings==>
router.get('/my-bookings', (0, checkAuth_1.default)(...Object.values(user_interface_1.Role)), booking_controller_1.BookingControllers.getMyBookings);
// get single booking==>
router.get('/:bookingId', (0, checkAuth_1.default)(...Object.values(user_interface_1.Role)), booking_controller_1.BookingControllers.getSingleBooking);
// update booking status==>
router.patch('/:bookingId/status', (0, checkAuth_1.default)(...Object.values(user_interface_1.Role)), (0, validateRequest_1.default)(booking_schema_1.updateBookingSchema), booking_controller_1.BookingControllers.updateBookingStatus);
exports.BookingRoutes = router;
