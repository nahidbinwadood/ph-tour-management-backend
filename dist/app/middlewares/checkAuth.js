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
const AppError_1 = __importDefault(require("../errorHelpers/AppError"));
const jwt_1 = require("../utils/jwt");
const env_1 = require("../config/env");
const user_model_1 = require("../modules/users/user.model");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const user_interface_1 = require("../modules/users/user.interface");
const checkAuth = (...authRoles) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '');
        if (!token)
            throw new AppError_1.default(403, 'No authorization token found');
        const verifiedToken = (0, jwt_1.verifyToken)(token, env_1.envVars.JWT_ACCESS_SECRET);
        if (!verifiedToken)
            throw new AppError_1.default(403, 'You are not authorized');
        const isUserExist = yield user_model_1.User.findById(verifiedToken.userId);
        // throw error if the user not found==>
        if (!isUserExist) {
            throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, 'User not found');
        }
        // throw error if the user is not verified==>
        if (!isUserExist.isVerified) {
            throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, `User is not verified`);
        }
        // throw error if the user is inactive or blocked==>
        if (isUserExist.isActive === user_interface_1.IsActive.BLOCKED ||
            isUserExist.isActive === user_interface_1.IsActive.INACTIVE) {
            throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, `User is ${isUserExist.isActive}`);
        }
        // throw error if the user is deleted==>
        if (isUserExist.isDeleted) {
            throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, `User is deleted`);
        }
        const verifyRole = authRoles.includes(isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.role);
        if (!verifyRole)
            throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, 'You are not authorized to access this feature');
        req.user = verifiedToken;
        next();
    }
    catch (error) {
        // console.log(error);
        next(error);
    }
});
exports.default = checkAuth;
