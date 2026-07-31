"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_route_1 = require("../modules/auth/auth.route");
const booking_route_1 = require("../modules/booking/booking.route");
const division_route_1 = require("../modules/division/division.route");
const file_route_1 = require("../modules/file/file.route");
const payment_route_1 = require("../modules/payment/payment.route");
const tour_route_1 = require("../modules/tour/tour.route");
const user_route_1 = require("../modules/users/user.route");
const router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: '/user',
        route: user_route_1.UserRoutes,
    },
    {
        path: '/auth',
        route: auth_route_1.AuthRoutes,
    },
    {
        path: '/division',
        route: division_route_1.DivisionRoutes,
    },
    {
        path: '/tour',
        route: tour_route_1.TourRoutes,
    },
    {
        path: '/booking',
        route: booking_route_1.BookingRoutes,
    },
    {
        path: '/payment',
        route: payment_route_1.PaymentRoutes,
    },
    {
        path: '/file',
        route: file_route_1.FileRoutes,
    },
];
moduleRoutes.forEach((route) => {
    router.use(route.path, route.route);
});
exports.default = router;
