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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthServices = void 0;
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const user_model_1 = require("../users/user.model");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jwt_1 = require("../../utils/jwt");
const server_1 = __importDefault(require("../../../server"));
// create user==>
const createUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield user_model_1.User.findOne({ email: payload.email });
    // check if the user already exists ===>
    if (isExist)
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, 'User already exists with this email');
    // hash the password==>
    payload.password = yield bcryptjs_1.default.hash(payload.password, Number(server_1.default.BCRYPT_SALT_ROUND));
    // set the auths==>
    const authProvider = {
        provider: 'credentials',
        providerId: payload.email,
    };
    // create user==>
    const user = yield user_model_1.User.create(Object.assign(Object.assign({}, payload), { auths: [authProvider] }));
    const _a = user.toObject(), { password } = _a, rest = __rest(_a, ["password"]);
    return Object.assign({}, rest);
});
// credentials login==>
const credentialsLogin = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield user_model_1.User.findOne({ email: payload.email });
    // throw error if the email doesn't exist==>
    if (!isExist) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, 'User not found with this email');
    }
    const isPasswordMatched = yield bcryptjs_1.default.compare(payload.password, isExist.password);
    //throw error if the password doest not match==>
    if (!isPasswordMatched) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, 'The email or password is not correct');
    }
    const tokens = (0, jwt_1.createUserTokens)(isExist);
    const _a = isExist.toObject(), { password } = _a, rest = __rest(_a, ["password"]);
    return Object.assign(Object.assign({}, rest), { tokens });
});
// get access token==>
const getNewAccessToken = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    const tokens = (0, jwt_1.generateNewAccessToken)(refreshToken);
    return tokens;
});
// reset password==>
const resetPassword = (payload, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const { oldPassword, newPassword } = payload;
    const isExist = yield user_model_1.User.findOne({ email: decodedToken.email });
    // throw error if the email is not exist==>
    if (!isExist) {
        throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, 'Email doest not exist');
    }
    const checkOldPasswordIsCorrect = yield bcryptjs_1.default.compare(oldPassword, isExist.password);
    // throw error if the old password is incorrect==>
    if (!checkOldPasswordIsCorrect) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, 'Old password is incorrect');
    }
    const isNewPasswordIsSameAsOldPassword = yield bcryptjs_1.default.compare(newPassword, isExist.password);
    // throw error if the new password is same as old password==>
    if (isNewPasswordIsSameAsOldPassword) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, 'New password cannot be same as old password');
    }
    const hashedPassword = yield bcryptjs_1.default.hash(newPassword, Number(server_1.default.BCRYPT_SALT_ROUND));
    const updatedResponse = yield user_model_1.User.findOneAndUpdate({ _id: decodedToken.userId }, { password: hashedPassword }, { new: true });
    if (updatedResponse) {
        const _a = updatedResponse === null || updatedResponse === void 0 ? void 0 : updatedResponse.toObject(), { password } = _a, rest = __rest(_a, ["password"]);
        return Object.assign({}, rest);
    }
});
exports.AuthServices = {
    credentialsLogin,
    createUser,
    getNewAccessToken,
    resetPassword,
};
