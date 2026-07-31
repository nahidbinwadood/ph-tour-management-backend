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
exports.BookingServices = void 0;
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const tour_model_1 = require("../tour/tour.model");
const booking_interface_1 = require("./booking.interface");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const booking_model_1 = require("./booking.model");
const user_model_1 = require("../users/user.model");
const payment_model_1 = require("../payment/payment.model");
const payment_interface_1 = require("../payment/payment.interface");
const sslCommerz_service_1 = require("../../sslCommerz/sslCommerz.service");
const QueryBuilder_1 = require("../../utils/QueryBuilder");
const getTransactionId_1 = require("../../utils/getTransactionId");
// max total booking amount allowed (SSLCommerz / business cap)==>
const MAX_BOOKING_AMOUNT = 500000;
// create booking==>
const createBooking = (payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const session = yield booking_model_1.Booking.startSession();
    session.startTransaction();
    try {
        const tour = payload.tour;
        const isTourExist = yield tour_model_1.Tour.findById(tour);
        // throw error if the tour doest not exist==>
        if (!isTourExist) {
            throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, 'Tour not found');
        }
        const userData = yield user_model_1.User.findById(userId);
        // throw error if the user do not have either phone number or address==>
        if (!(userData === null || userData === void 0 ? void 0 : userData.phone) || !(userData === null || userData === void 0 ? void 0 : userData.address)) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, 'Please update your profile to book a tour');
        }
        const amount = Number(isTourExist === null || isTourExist === void 0 ? void 0 : isTourExist.costFrom) * Number(payload === null || payload === void 0 ? void 0 : payload.guestCount);
        // throw error if the amount is greater than the max==>
        if (amount > MAX_BOOKING_AMOUNT) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, 'Max amount reached !! Decrease your guest count to proceed with the booking');
        }
        // create the booking for the user==>
        const bookingPayload = {
            user: userId,
            tour: payload === null || payload === void 0 ? void 0 : payload.tour,
            guestCount: payload === null || payload === void 0 ? void 0 : payload.guestCount,
            status: booking_interface_1.BOOKING_STATUS.PENDING,
        };
        const booking = yield booking_model_1.Booking.create([bookingPayload], {
            session,
        });
        // generate the transaction id and create a payment for this booking==>
        const transactionId = (0, getTransactionId_1.getTransactionId)(userId);
        const paymentPayload = {
            booking: (_a = booking[0]) === null || _a === void 0 ? void 0 : _a.id,
            transactionId,
            amount,
            status: payment_interface_1.PAYMENT_STATUS.UNPAID,
        };
        const payment = yield payment_model_1.Payment.create([paymentPayload], { session });
        // update the booking data and add the payment id==>
        const updatedBookingData = yield booking_model_1.Booking.findByIdAndUpdate((_b = booking[0]) === null || _b === void 0 ? void 0 : _b.id, {
            payment: (_c = payment[0]) === null || _c === void 0 ? void 0 : _c.id,
        }, {
            new: true,
            runValidators: true,
            session,
        })
            .populate('user', 'name email address phone role')
            .populate('payment', 'transactionId status amount');
        // initiate the payment==>
        const sslPayment = yield sslCommerz_service_1.SSLService.sslPaymentInit({
            transactionId,
            amount,
            name: userData === null || userData === void 0 ? void 0 : userData.name,
            email: userData === null || userData === void 0 ? void 0 : userData.email,
            phoneNumber: userData === null || userData === void 0 ? void 0 : userData.phone,
            address: userData === null || userData === void 0 ? void 0 : userData.address,
        });
        // throw error if there is no gateway url==>
        if (!sslPayment.GatewayPageURL) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, 'Failed to proceed payment');
        }
        // commit the session==>
        yield session.commitTransaction();
        session.endSession();
        return {
            paymentUrl: sslPayment === null || sslPayment === void 0 ? void 0 : sslPayment.GatewayPageURL,
            booking: updatedBookingData,
        };
    }
    catch (error) {
        console.log(error);
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
// get all bookings==>
const getAllBookings = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const queryBuilder = new QueryBuilder_1.QueryBuilder(booking_model_1.Booking.find()
        .populate('user', 'name email role phone address')
        .populate('tour', 'title description location costFrom maxGuest'), query);
    const bookings = queryBuilder.filter().sort().fields().paginate();
    const [data, meta] = yield Promise.all([
        bookings.build(),
        queryBuilder.getMeta(),
    ]);
    return {
        data,
        meta,
    };
});
// get my bookings==>
const getMyBookings = (userId, query) => __awaiter(void 0, void 0, void 0, function* () {
    const queryBuilder = new QueryBuilder_1.QueryBuilder(booking_model_1.Booking.find({ user: userId })
        .populate('user', 'name email role phone address')
        .populate('tour', 'title description location costFrom maxGuest'), query);
    const tour = queryBuilder.filter().sort().fields().paginate();
    const [data, meta] = yield Promise.all([
        tour.build(),
        queryBuilder.getMeta(),
    ]);
    return { data, meta };
});
// get single booking==>
const getSingleBooking = (bookingId) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield booking_model_1.Booking.findById(bookingId)
        .populate('user', 'name email role phone address')
        .populate('tour', 'title description location costFrom maxGuest');
    // throw error if the booking not found==>
    if (!response) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, 'Booking not found');
    }
    return response;
});
// get single booking==>
const updateBookingStatus = (bookingId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield booking_model_1.Booking.findByIdAndUpdate(bookingId, {
        status: payload.status,
    }, {
        new: true,
        runValidators: true,
    })
        .populate('user', 'name email role phone address')
        .populate('tour', 'title description location costFrom maxGuest');
    // throw error if the booking not found==>
    if (!response) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, 'Booking not found');
    }
    return response;
});
exports.BookingServices = {
    createBooking,
    getAllBookings,
    getMyBookings,
    getSingleBooking,
    updateBookingStatus,
};
