"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBookingSchema = exports.createBookingSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const booking_interface_1 = require("./booking.interface");
exports.createBookingSchema = zod_1.default.object({
    tour: zod_1.default.string().min(1, 'Tour is required'),
    guestCount: zod_1.default.coerce
        .number('Guest count must be a number')
        .min(1, 'Guest count is required'),
});
const bookingStatusValues = Object.values(booking_interface_1.BOOKING_STATUS);
exports.updateBookingSchema = zod_1.default.object({
    status: zod_1.default.enum(bookingStatusValues, `Status must be one of ${bookingStatusValues.join(', ')}`),
});
