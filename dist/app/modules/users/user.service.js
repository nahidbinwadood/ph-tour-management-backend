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
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const user_interface_1 = require("./user.interface");
const user_model_1 = require("./user.model");
const env_1 = require("../../config/env");
// get all the users==>
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.find({});
    const updatedResponse = user === null || user === void 0 ? void 0 : user.map((user) => {
        const response = user.toObject();
        delete response.password;
        return Object.assign({}, response);
    });
    return updatedResponse;
});
// get single user==>
const getSingleUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(id);
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, 'User not found');
    }
    const response = user.toObject();
    delete response.password;
    return Object.assign({}, response);
});
// delete user==>
const deleteUser = (id, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    // throw error if the id is not provided==>
    if (!id) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_GATEWAY, 'Please provide user id');
    }
    //super admin cannot delete a super admin==>
    const selectedUserData = yield user_model_1.User.findOne({ _id: id });
    // throw error if super admin wants to delete a super admin==>
    if ((decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.role) === user_interface_1.Role.SUPER_ADMIN &&
        (selectedUserData === null || selectedUserData === void 0 ? void 0 : selectedUserData.role) === user_interface_1.Role.SUPER_ADMIN) {
        throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, 'You are not authorized to delete a super admin');
    }
    // throw error if the admin wants to delete a super admin==>
    if (decodedToken.role == user_interface_1.Role.ADMIN &&
        (selectedUserData === null || selectedUserData === void 0 ? void 0 : selectedUserData.role) === user_interface_1.Role.SUPER_ADMIN) {
        throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, "You don't have permission to delete a super admin");
    }
    // throw error if the admin wants to delete a admin==>
    if (decodedToken.role === user_interface_1.Role.ADMIN &&
        (selectedUserData === null || selectedUserData === void 0 ? void 0 : selectedUserData.role) === user_interface_1.Role.ADMIN) {
        throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, "You don't have permission to delete a admin");
    }
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
// get me ==>
const getMe = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield user_model_1.User.findById(userId).select('-password');
    if (!response) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, 'User not found');
    }
    return response;
});
exports.UserServices = {
    getAllUsers,
    getSingleUser,
    deleteUser,
    updateUser,
    getMe,
};
