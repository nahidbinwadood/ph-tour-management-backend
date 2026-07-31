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
exports.PaymentServices = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const sslCommerz_service_1 = require("../../sslCommerz/sslCommerz.service");
const QueryBuilder_1 = require("../../utils/QueryBuilder");
const booking_interface_1 = require("../booking/booking.interface");
const booking_model_1 = require("../booking/booking.model");
const payment_interface_1 = require("./payment.interface");
const payment_model_1 = require("./payment.model");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
// init payment==>
const initPayment = (bookingId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const booking = yield booking_model_1.Booking.findById(bookingId);
    if (!booking) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, 'Booking not found');
    }
    const payment = yield payment_model_1.Payment.findById(booking === null || booking === void 0 ? void 0 : booking.payment);
    if (!payment) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, 'Payment not found');
    }
    const sslPayload = {
        amount: payment === null || payment === void 0 ? void 0 : payment.amount,
        transactionId: payment === null || payment === void 0 ? void 0 : payment.transactionId,
        name: (_a = booking.user) === null || _a === void 0 ? void 0 : _a.name,
        email: (_b = booking.user) === null || _b === void 0 ? void 0 : _b.email,
        phoneNumber: (_c = booking.user) === null || _c === void 0 ? void 0 : _c.phone,
        address: (_d = booking.user) === null || _d === void 0 ? void 0 : _d.address,
    };
    const sslPayment = yield sslCommerz_service_1.SSLService.sslPaymentInit(sslPayload);
    return {
        paymentUrl: sslPayment === null || sslPayment === void 0 ? void 0 : sslPayment.GatewayPageURL,
    };
});
// success payment==>
const successPayment = (transactionId) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield payment_model_1.Payment.startSession();
    session.startTransaction();
    try {
        const payment = yield payment_model_1.Payment.findOne({ transactionId });
        // throw error if payment not found==>
        if (!payment) {
            throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, 'Payment not found');
        }
        // update the payment status ==>
        yield payment_model_1.Payment.findByIdAndUpdate(payment === null || payment === void 0 ? void 0 : payment.id, { status: payment_interface_1.PAYMENT_STATUS.PAID }, { new: true, runValidators: true, session });
        // update the booking status ==>
        yield booking_model_1.Booking.findByIdAndUpdate(payment.booking, {
            status: booking_interface_1.BOOKING_STATUS.COMPLETE,
        }, {
            new: true,
            runValidators: true,
            session,
        })
            .populate('user', 'name email address phone role')
            .populate('payment', 'transactionId status amount');
        yield session.commitTransaction();
        session.endSession();
        return {
            success: true,
            message: 'Payment completed successfully',
        };
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
// failed payment==>
const failedPayment = (transactionId) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield payment_model_1.Payment.startSession();
    session.startTransaction();
    try {
        const payment = yield payment_model_1.Payment.findOne({ transactionId });
        // throw error if payment not found==>
        if (!payment) {
            throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, 'Payment not found');
        }
        // update the payment status ==>
        yield payment_model_1.Payment.findByIdAndUpdate(payment === null || payment === void 0 ? void 0 : payment.id, { status: payment_interface_1.PAYMENT_STATUS.FAILED }, { new: true, runValidators: true, session });
        // update the booking status ==>
        yield booking_model_1.Booking.findByIdAndUpdate(payment.booking, {
            status: booking_interface_1.BOOKING_STATUS.FAILED,
        }, {
            new: true,
            runValidators: true,
            session,
        })
            .populate('user', 'name email address phone role')
            .populate('payment', 'transactionId status amount');
        yield session.commitTransaction();
        session.endSession();
        return {
            success: false,
            message: 'Payment failed',
        };
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
// cancel payment==>
const cancelPayment = (transactionId) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield payment_model_1.Payment.startSession();
    session.startTransaction();
    try {
        const payment = yield payment_model_1.Payment.findOne({ transactionId });
        // throw error if payment not found==>
        if (!payment) {
            throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, 'Payment not found');
        }
        // update the payment status ==>
        yield payment_model_1.Payment.findByIdAndUpdate(payment === null || payment === void 0 ? void 0 : payment.id, { status: payment_interface_1.PAYMENT_STATUS.CANCELLED }, { new: true, runValidators: true, session });
        // update the booking status ==>
        yield booking_model_1.Booking.findByIdAndUpdate(payment.booking, {
            status: booking_interface_1.BOOKING_STATUS.CANCEL,
        }, {
            new: true,
            runValidators: true,
            session,
        })
            .populate('user', 'name email address phone role')
            .populate('payment', 'transactionId status amount');
        yield session.commitTransaction();
        session.endSession();
        return {
            success: false,
            message: 'Payment cancelled!',
        };
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
// get all payments==>
const getAllPayments = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const queryBuilder = new QueryBuilder_1.QueryBuilder(booking_model_1.Booking.find(), query);
    const payment = queryBuilder.filter().sort().fields().paginate();
    const [data, meta] = yield Promise.all([
        payment.build().populate('user', 'name email address phone role'),
        queryBuilder.getMeta(),
    ]);
    return { data, meta };
});
exports.PaymentServices = {
    initPayment,
    successPayment,
    failedPayment,
    cancelPayment,
    getAllPayments,
};
