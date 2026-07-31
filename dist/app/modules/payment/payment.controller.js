"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentControllers = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const payment_service_1 = require("./payment.service");
const env_1 = require("../../config/env");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
// init payment==>
const initPayment = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bookingId = req.params.bookingId;
    if (!bookingId) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, 'Booking id is missing');
    }
    const response = yield payment_service_1.PaymentServices.initPayment(bookingId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: 'Payment initiated successfully',
        data: response,
    });
}));
// success payment==>
const successPayment = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const transactionId = req.query.transactionId;
    const amount = req.query.amount;
    const status = req.query.status;
    if (!transactionId) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, 'Transaction id is missing');
    }
    const response = yield payment_service_1.PaymentServices.successPayment(transactionId);
    if (response.success) {
        res.redirect(`${env_1.envVars.SSL_SUCCESS_FRONTEND_URL}?transactionId=${transactionId}&message=${response.message}&amount=${amount}&status=${status}`);
    }
}));
// failed payment==>
const failedPayment = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const transactionId = req.query.transactionId;
    const amount = req.query.amount;
    const status = req.query.status;
    if (!transactionId) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, 'Transaction id is missing');
    }
    const response = yield payment_service_1.PaymentServices.failedPayment(transactionId);
    if (!response.success) {
        res.redirect(`${env_1.envVars.SSL_FAIL_FRONTEND_URL}?transactionId=${transactionId}&message=${response.message}&amount=${amount}&status=${status}`);
    }
}));
// cancel payment==>
const cancelPayment = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const transactionId = req.query.transactionId;
    const amount = req.query.amount;
    const status = req.query.status;
    if (!transactionId) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, 'Transaction id is missing');
    }
    const response = yield payment_service_1.PaymentServices.cancelPayment(transactionId);
    if (!response.success) {
        res.redirect(`${env_1.envVars.SSL_CANCEL_FRONTEND_URL}?transactionId=${transactionId}&message=${response.message}&amount=${amount}&status=${status}`);
    }
}));
// get all payments==>
const getAllPayments = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield payment_service_1.PaymentServices.getAllPayments(req.query);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: 'All payments data fetched successfully',
        data: response,
    });
}));
exports.PaymentControllers = {
    initPayment,
    successPayment,
    failedPayment,
    cancelPayment,
    getAllPayments,
};
