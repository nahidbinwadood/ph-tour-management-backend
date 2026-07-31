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
exports.AuthControllers = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const catchAsync_1 = require("../../utils/catchAsync");
const cookie_1 = require("../../utils/cookie");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const auth_service_1 = require("./auth.service");
const jwt_1 = require("../../utils/jwt");
const env_1 = require("../../config/env");
const passport_1 = __importDefault(require("passport"));
const axios_1 = require("axios");
// create user==>
const createUser = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield auth_service_1.AuthServices.createUser(req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: 'An OTP has been sent to your email',
        data: response,
    });
}));
// verify otp==>
const verifyOtp = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { otp, token } = req.body;
    const response = yield auth_service_1.AuthServices.verifyOtp(otp, token);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: 'OTP verification successful',
        data: response,
    });
}));
// resend otp==>
const resendOtp = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.body;
    const response = yield auth_service_1.AuthServices.resendOtp(token);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: 'A new OTP has been send to your email.',
        data: response,
    });
}));
// credentials login==>
const credentialsLogin = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    passport_1.default.authenticate('local', (err, user, info) => __awaiter(void 0, void 0, void 0, function* () {
        // if error then show the error==>
        if (err) {
            return next(new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, err));
        }
        // show error if the
        if (!user) {
            return next(new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, info === null || info === void 0 ? void 0 : info.message));
        }
        const userTokens = (0, jwt_1.createUserTokens)(user);
        const userObj = user.toObject();
        delete userObj.password;
        (0, cookie_1.setAuthCookie)(res, userTokens);
        (0, sendResponse_1.default)(res, {
            success: true,
            statusCode: http_status_codes_1.default.OK,
            message: 'User Logged In Successfully',
            data: {
                tokens: Object.assign({}, userTokens),
                user: userObj,
            },
        });
    }))(req, res, next);
}));
// get new access token==>
const getNewAccessToken = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, 'No refresh token found from cookies');
    }
    const response = yield auth_service_1.AuthServices.getNewAccessToken(refreshToken);
    (0, cookie_1.setAuthCookie)(res, response);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: 'New Access Token Retrieved Successfully',
        data: response,
    });
}));
// logout ==>
const logout = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, cookie_1.removeCookie)(res, ['accessToken', 'refreshToken']);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: 'You have been logged out successfully',
    });
}));
// change password==>
const changePassword = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    const response = yield auth_service_1.AuthServices.changePassword(req.body, userId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: 'Password changed successfully',
        data: response,
    });
}));
// set password==>
const setPassword = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    const response = yield auth_service_1.AuthServices.setPassword(req.body, userId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: axios_1.HttpStatusCode.Ok,
        message: 'Password set successfully',
        data: response,
    });
}));
// google redirect==>
const googleCallback = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let redirectTo = req.query.state ? req.query.state : '';
    if (redirectTo.startsWith('/')) {
        redirectTo = redirectTo.slice(1);
    }
    const user = req.user;
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, 'User not found');
    }
    const tokenInfo = (0, jwt_1.createUserTokens)(user);
    (0, cookie_1.setAuthCookie)(res, tokenInfo);
    res.redirect(`${env_1.envVars.FRONTEND_URL}/${redirectTo}`);
}));
// forget password==>
const forgetPassword = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    yield auth_service_1.AuthServices.forgetPassword(email);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: 'Email Sent Successfully',
    });
}));
// reset password==>
const resetPassword = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    yield auth_service_1.AuthServices.resetPassword(req.body, decodedToken);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: 'Password reset completed successfully',
    });
}));
exports.AuthControllers = {
    credentialsLogin,
    verifyOtp,
    resendOtp,
    createUser,
    getNewAccessToken,
    logout,
    resetPassword,
    changePassword,
    setPassword,
    forgetPassword,
    googleCallback,
};
