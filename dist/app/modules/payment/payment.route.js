"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentRoutes = void 0;
const express_1 = require("express");
const payment_controller_1 = require("./payment.controller");
const checkAuth_1 = __importDefault(require("../../middlewares/checkAuth"));
const user_interface_1 = require("../users/user.interface");
const router = (0, express_1.Router)();
// payment init==>
router.post('/init-payment/:bookingId', payment_controller_1.PaymentControllers.initPayment);
// success ==>
router.post('/success', payment_controller_1.PaymentControllers.successPayment);
// fail ==>
router.post('/fail', payment_controller_1.PaymentControllers.failedPayment);
// cancel ==>
router.post('/cancel', payment_controller_1.PaymentControllers.cancelPayment);
// get all payments==>
router.get('/get-all', (0, checkAuth_1.default)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), payment_controller_1.PaymentControllers.getAllPayments);
exports.PaymentRoutes = router;
