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
exports.DivisionServices = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const division_model_1 = require("./division.model");
const cloudinary_config_1 = require("../../config/cloudinary.config");
// create division==>
const createDivision = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isAlreadyExist = yield division_model_1.Division.findOne({ name: payload.name });
    if (isAlreadyExist) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, 'A division with this name is already exists');
    }
    const response = yield division_model_1.Division.create(payload);
    return response;
});
// get all divisions==>
const getAllDivisions = () => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield division_model_1.Division.find({});
    return response;
});
// get single division==>
const getSingleDivision = (slug) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield division_model_1.Division.findOne({ slug });
    if (!isExist) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, 'Division not found');
    }
    return isExist;
});
// update division==>
const updateDivision = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield division_model_1.Division.findById(id);
    if (!isExist) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, 'Division not found');
    }
    const duplicateDivision = yield division_model_1.Division.findOne({
        name: payload.name,
        _id: { $ne: id },
    });
    if (duplicateDivision) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, 'A division with this name is already exists');
    }
    const session = yield division_model_1.Division.startSession();
    session.startTransaction();
    try {
        const response = yield division_model_1.Division.findByIdAndUpdate(id, payload, {
            new: true,
            runValidators: true,
            session,
        });
        if (isExist === null || isExist === void 0 ? void 0 : isExist.thumbnail) {
            yield (0, cloudinary_config_1.deleteCloudinaryImage)(isExist.thumbnail);
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
// delete division==>
const deleteDivision = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield division_model_1.Division.findById(id);
    if (!isExist) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, 'Division not found');
    }
    const session = yield division_model_1.Division.startSession();
    session.startTransaction();
    try {
        const response = yield division_model_1.Division.findByIdAndDelete(id, { session });
        if (isExist === null || isExist === void 0 ? void 0 : isExist.thumbnail) {
            yield (0, cloudinary_config_1.deleteCloudinaryImage)(isExist === null || isExist === void 0 ? void 0 : isExist.thumbnail);
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
exports.DivisionServices = {
    createDivision,
    getAllDivisions,
    getSingleDivision,
    updateDivision,
    deleteDivision,
};
