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
exports.generateNewAccessToken = exports.verifyToken = exports.createUserTokens = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const server_1 = __importDefault(require("../../server"));
const user_interface_1 = require("../modules/users/user.interface");
const user_model_1 = require("../modules/users/user.model");
const AppError_1 = __importDefault(require("../errorHelpers/AppError"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
// create user token==>
const createUserTokens = (data) => {
    const payload = {
        userId: data.id,
        email: data.email,
        role: data.role,
    };
    const accessToken = jsonwebtoken_1.default.sign(payload, server_1.default.JWT_ACCESS_SECRET, {
        expiresIn: server_1.default.JWT_ACCESS_EXPIRES,
    });
    const refreshToken = jsonwebtoken_1.default.sign(payload, server_1.default.JWT_REFRESH_SECRET, {
        expiresIn: server_1.default.JWT_REFRESH_EXPIRES,
    });
    return {
        accessToken,
        refreshToken,
    };
};
exports.createUserTokens = createUserTokens;
// verify token==>
const verifyToken = (token, secret) => {
    return jsonwebtoken_1.default.verify(token, secret);
};
exports.verifyToken = verifyToken;
// generate new access token==>
const generateNewAccessToken = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = (0, exports.verifyToken)(refreshToken, server_1.default.JWT_REFRESH_SECRET);
    const userData = yield user_model_1.User.findOne({ _id: decodedToken.userId });
    if (!userData) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, 'User not found');
    }
    // throw error if the user is not active==>
    if ((userData === null || userData === void 0 ? void 0 : userData.isActive) !== user_interface_1.IsActive.ACTIVE) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, `User is ${userData === null || userData === void 0 ? void 0 : userData.isActive}`);
    }
    // throw error if the user is deleted==>
    if (userData === null || userData === void 0 ? void 0 : userData.isDeleted) {
        throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, `You don't have permission to do this action`);
    }
    const tokens = (0, exports.createUserTokens)(userData);
    return tokens;
});
exports.generateNewAccessToken = generateNewAccessToken;
