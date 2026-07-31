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
exports.TourControllers = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const tour_service_1 = require("./tour.service");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
// ============= Tour Types ================
// create tour types==>
const createTourTypes = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield tour_service_1.TourServices.createTourType(req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: 'Tour type created successfully',
        data: response,
    });
}));
// all tour types==>
const getAllTourTypes = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield tour_service_1.TourServices.getAllTourTypes();
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: 'Tour types data fetched successfully',
        data: response,
    });
}));
// single tour type==>
const getSingleTourType = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    if (!id) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, 'Tour type is missing');
    }
    const response = yield tour_service_1.TourServices.getSingleTourType(id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: 'Tour types data fetched successfully',
        data: response,
    });
}));
// update tour types==>
const updateTourTypes = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const response = yield tour_service_1.TourServices.updateTourTypes(id, req.body);
    if (!id) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, 'Tour type id is missing');
    }
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: 'Tour type updated successfully',
        data: response,
    });
}));
// delete tour types==>
const deleteTourTypes = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    yield tour_service_1.TourServices.deleteTourTypes(id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: 'Tour type deleted successfully',
    });
}));
// ============= Tour ================
// create tour==>
const createTour = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const imageUrls = (_a = req.files) === null || _a === void 0 ? void 0 : _a.map((item) => item === null || item === void 0 ? void 0 : item.path);
    const payload = Object.assign(Object.assign({}, req.body), { images: [...imageUrls] });
    const response = yield tour_service_1.TourServices.createTour(payload);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: 'Tour created successfully',
        data: response,
    });
}));
// get all tours==>
const getAllTours = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query || '';
    const response = yield tour_service_1.TourServices.getAllTours(query);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: 'All tours data fetched successfully',
        data: response,
    });
}));
// get single tour==>
const getSingleTour = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const slug = req.params.slug;
    if (!slug) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, 'Slug is missing');
    }
    const response = yield tour_service_1.TourServices.getSingleTour(slug);
    if (!response) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, 'Invalid slug provided');
    }
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: 'Tour data fetched successfully',
        data: response,
    });
}));
// update tour==>
const updateTour = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const id = req.params.id;
    if (!id) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, 'Tour id is missing');
    }
    const newImageUrls = (_a = req.files) === null || _a === void 0 ? void 0 : _a.map((item) => item === null || item === void 0 ? void 0 : item.path);
    const payload = Object.assign(Object.assign({}, req.body), { images: [...newImageUrls] });
    const response = yield tour_service_1.TourServices.updateTour(id, payload);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: 'Tour updated successfully',
        data: response,
    });
}));
// delete tour==>
const deleteTour = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    yield tour_service_1.TourServices.deleteTour(id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: 'Tour deleted successfully',
    });
}));
exports.TourControllers = {
    createTourTypes,
    getAllTourTypes,
    getSingleTourType,
    updateTourTypes,
    deleteTourTypes,
    createTour,
    getAllTours,
    getSingleTour,
    updateTour,
    deleteTour,
};
