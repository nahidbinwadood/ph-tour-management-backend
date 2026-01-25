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
exports.UserServices = void 0;
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const user_interface_1 = require("./user.interface");
const user_model_1 = require("./user.model");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const env_1 = require("../../config/env");
const jwt_1 = require("../../utils/jwt");
// create user==>
const createUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield user_model_1.User.findOne({ email: payload.email });
    // check if the user already exists ===>
    if (isExist)
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, 'User already exists with this email');
    // hash the password==>
    payload.password = yield bcryptjs_1.default.hash(payload.password, Number(env_1.envVars.BCRYPT_SALT_ROUND));
    // set the auths==>
    const authProvider = {
        provider: 'credentials',
        providerId: payload.email,
    };
    // create user==>
    const user = yield user_model_1.User.create(Object.assign(Object.assign({}, payload), { auths: [authProvider] }));
    return user;
});
// get all the users==>
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.find({});
    return user;
});
// login ==>
const loginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield user_model_1.User.findOne({ email: payload.email });
    if (!isExist)
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, 'No user found with this email');
    const passwordMatch = yield bcryptjs_1.default.compare(payload.password, isExist.password);
    if (!passwordMatch)
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, 'The email or password doesn’t seem right. Please double-check and try again 🔁');
    const jwtPayload = {
        userId: isExist === null || isExist === void 0 ? void 0 : isExist.id,
        email: isExist === null || isExist === void 0 ? void 0 : isExist.email,
        role: isExist === null || isExist === void 0 ? void 0 : isExist.role,
    };
    const accessToken = (0, jwt_1.generateToken)(jwtPayload, env_1.envVars.JWT_SECRET, env_1.envVars.JWT_ACCESS_EXPIRES);
    return {
        accessToken,
    };
});
// delete user==>
const deleteUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    if (!id)
        throw new AppError_1.default(http_status_codes_1.default.BAD_GATEWAY, 'Please provide user id');
    const result = yield user_model_1.User.findOneAndDelete({ _id: id });
    if (!result) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, 'User not found');
    }
    return result;
});
// update user==>
const updateUser = (userId, payload, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield user_model_1.User.findById(userId);
    if (!isUserExist)
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, 'User not found');
    // check the role==>
    if (payload.role) {
        // if the user or guide tries to update their role==>
        if (decodedToken.role == user_interface_1.Role.USER || decodedToken.role == user_interface_1.Role.GUIDE) {
            throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, 'You are not authorized to access this');
        }
        // if the admin want to update his role==>
        if (decodedToken.role == user_interface_1.Role.ADMIN && payload.role == user_interface_1.Role.SUPER_ADMIN) {
            throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, 'You are not authorized to access this');
        }
    }
    // check the user status update from USER or GUIDE==>
    if (payload.isActive || payload.isDeleted || payload.isVerified) {
        if ((decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.role) == user_interface_1.Role.USER || (decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.role) === user_interface_1.Role.GUIDE) {
            throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, 'You are not authorized to access this');
        }
    }
    // update the password==>
    if (payload.password) {
        payload.password = yield bcryptjs_1.default.hash(payload.password, Number(env_1.envVars.BCRYPT_SALT_ROUND));
    }
    const newUpdateUser = yield user_model_1.User.findByIdAndUpdate(userId, payload, {
        new: true,
        runValidators: true,
    });
    return newUpdateUser;
});
exports.UserServices = {
    createUser,
    getAllUsers,
    loginUser,
    deleteUser,
    updateUser,
};
