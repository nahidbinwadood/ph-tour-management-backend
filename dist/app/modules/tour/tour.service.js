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
exports.TourServices = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const division_model_1 = require("../division/division.model");
const tour_contant_1 = require("./tour.contant");
const tour_model_1 = require("./tour.model");
const QueryBuilder_1 = require("../../utils/QueryBuilder");
const cloudinary_config_1 = require("../../config/cloudinary.config");
// ============= Tour Types ================
// create tour type==>
const createTourType = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield tour_model_1.TourType.findOne({ name: payload.name });
    if (isExist) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, 'This tour type is already exists');
    }
    const response = yield tour_model_1.TourType.create(payload);
    return response;
});
// get all tour types==>
const getAllTourTypes = () => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield tour_model_1.TourType.find({});
    return response;
});
// single tour type==>
const getSingleTourType = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield tour_model_1.TourType.findById(id);
    return response;
});
// update tour types==>
const updateTourTypes = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield tour_model_1.TourType.findById(id);
    if (!isExist) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, 'Tour Type not found');
    }
    const duplicateTourTypes = yield tour_model_1.TourType.findOne({
        name: payload.name,
        _id: { $ne: id },
    });
    if (duplicateTourTypes) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, 'A Tour type with this name is already exists, Please try another name');
    }
    const response = yield tour_model_1.TourType.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    return response;
});
// delete tour types==>
const deleteTourTypes = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield tour_model_1.TourType.findById(id);
    if (!isExist) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, 'Tour Type not found');
    }
    yield tour_model_1.TourType.findByIdAndDelete(id);
});
// ============= Tour  ================
// create tour==>
const createTour = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield tour_model_1.Tour.findOne({ title: payload.title });
    if (isExist) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, 'This tour title is already exists. Please try another tour title');
    }
    const tourTypeExists = yield tour_model_1.TourType.findById(payload.tourType);
    if (!tourTypeExists) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, 'Tour type does not exist. Please provide a valid tour type');
    }
    const divisionExists = yield division_model_1.Division.findById(payload.division);
    if (!divisionExists) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, 'Division does not exist. Please provide a valid division');
    }
    const response = yield tour_model_1.Tour.create(payload);
    return response;
});
// get all tours==>
const getAllTours = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const queryBuilder = new QueryBuilder_1.QueryBuilder(tour_model_1.Tour.find(), query);
    const tour = queryBuilder
        .filter()
        .search(tour_contant_1.tourSearchableFields)
        .sort()
        .fields()
        .paginate();
    const [data, meta] = yield Promise.all([
        tour.build(),
        queryBuilder.getMeta(),
    ]);
    return {
        data,
        meta,
    };
});
// get single tour==>
const getSingleTour = (slug) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield tour_model_1.Tour.findOne({ slug });
    return response;
});
// update tour ==>
const updateTour = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const isExist = yield tour_model_1.Tour.findById(id);
    if (!isExist) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, 'Tour  not found');
    }
    const duplicateTourTypes = yield tour_model_1.TourType.findOne({
        name: payload.title,
        _id: { $ne: id },
    });
    if (duplicateTourTypes) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, 'A Tour type with this name is already exists, Please try another name');
    }
    // check the tour type==>
    if (payload.tourType) {
        const tourTypeExists = yield tour_model_1.TourType.findById(payload.tourType);
        if (!tourTypeExists) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, 'Tour type does not exist. Please provide a valid tour type');
        }
    }
    // check the division==>
    if (payload.division) {
        const divisionExists = yield division_model_1.Division.findById(payload.division);
        if (!divisionExists) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, 'Division does not exist. Please provide a valid division');
        }
    }
    const session = yield tour_model_1.Tour.startSession();
    session.startTransaction();
    try {
        // if user add new images==>
        if ((payload === null || payload === void 0 ? void 0 : payload.images) &&
            !!((_a = payload === null || payload === void 0 ? void 0 : payload.images) === null || _a === void 0 ? void 0 : _a.length) &&
            (isExist === null || isExist === void 0 ? void 0 : isExist.images) &&
            !!((_b = isExist === null || isExist === void 0 ? void 0 : isExist.images) === null || _b === void 0 ? void 0 : _b.length)) {
            payload.images = [...isExist.images, ...payload.images];
        }
        // if user only delete images==>
        if ((payload === null || payload === void 0 ? void 0 : payload.deletedFiles) &&
            !!((_c = payload === null || payload === void 0 ? void 0 : payload.deletedFiles) === null || _c === void 0 ? void 0 : _c.length) &&
            !payload.images) {
            payload.images = (_d = isExist === null || isExist === void 0 ? void 0 : isExist.images) === null || _d === void 0 ? void 0 : _d.filter((url) => { var _a; return !((_a = payload === null || payload === void 0 ? void 0 : payload.deletedFiles) === null || _a === void 0 ? void 0 : _a.includes(url)); });
        }
        // if the user upload image and delete image at the same time==>
        if ((payload === null || payload === void 0 ? void 0 : payload.images) &&
            !!(payload === null || payload === void 0 ? void 0 : payload.images) &&
            (payload === null || payload === void 0 ? void 0 : payload.deletedFiles) &&
            !!payload.deletedFiles.length) {
            const restDbImages = ((_e = isExist === null || isExist === void 0 ? void 0 : isExist.images) === null || _e === void 0 ? void 0 : _e.filter((url) => { var _a; return !((_a = payload.deletedFiles) === null || _a === void 0 ? void 0 : _a.includes(url)); })) || [];
            const updatedImagesUrls = ((_f = payload.images) === null || _f === void 0 ? void 0 : _f.filter((url) => { var _a; return !((_a = payload.deletedFiles) === null || _a === void 0 ? void 0 : _a.includes(url)); }).filter((url) => !restDbImages.includes(url))) || [];
            payload.images = [...restDbImages, ...updatedImagesUrls];
        }
        const response = yield tour_model_1.Tour.findByIdAndUpdate(id, payload, {
            new: true,
            runValidators: true,
            session,
        });
        // delete all the unused images==>
        if ((payload === null || payload === void 0 ? void 0 : payload.deletedFiles) && ((_g = payload === null || payload === void 0 ? void 0 : payload.deletedFiles) === null || _g === void 0 ? void 0 : _g.length)) {
            yield Promise.all((_h = payload === null || payload === void 0 ? void 0 : payload.deletedFiles) === null || _h === void 0 ? void 0 : _h.map((url) => (0, cloudinary_config_1.deleteCloudinaryImage)(url)));
        }
        yield session.commitTransaction();
        session.endSession();
        return response;
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
// delete tour==>
const deleteTour = (id) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const isExist = yield tour_model_1.Tour.findById(id);
    if (!isExist) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, 'Tour not found');
    }
    const session = yield tour_model_1.Tour.startSession();
    session.startTransaction();
    try {
        yield tour_model_1.Tour.findByIdAndDelete(id, { session });
        // delete the images from cloudinary if there is any tour image==>
        if ((isExist === null || isExist === void 0 ? void 0 : isExist.images) && !!((_a = isExist === null || isExist === void 0 ? void 0 : isExist.images) === null || _a === void 0 ? void 0 : _a.length)) {
            yield Promise.all((_b = isExist === null || isExist === void 0 ? void 0 : isExist.images) === null || _b === void 0 ? void 0 : _b.map((url) => (0, cloudinary_config_1.deleteCloudinaryImage)(url)));
        }
        yield session.commitTransaction();
        session.endSession();
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
exports.TourServices = {
    createTourType,
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
