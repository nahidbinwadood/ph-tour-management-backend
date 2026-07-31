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
exports.AuthServices = void 0;
const env_1 = require("./../../config/env");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const redis_config_1 = require("../../config/redis.config");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const generateOtp_1 = require("../../utils/generateOtp");
const jwt_1 = require("../../utils/jwt");
const sendEmail_1 = require("../../utils/sendEmail");
const user_model_1 = require("../users/user.model");
const OTP_EXPIRATION = 2 * 60;
// create user==>
const createUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield user_model_1.User.startSession();
    session.startTransaction();
    try {
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
        const userObject = user.toObject();
        delete userObject.password;
        const key = `${user === null || user === void 0 ? void 0 : user.email}`;
        const otp = (0, generateOtp_1.generateOtp)(6);
        // generate otp and set it to the redis==>
        yield redis_config_1.redisClient.set(key, otp, {
            expiration: {
                type: 'EX',
                value: OTP_EXPIRATION,
            },
        });
        // send email==>
        yield (0, sendEmail_1.sendMail)({
            to: userObject === null || userObject === void 0 ? void 0 : userObject.email,
            subject: 'Account Verification OTP',
            templateName: 'send-otp',
            templateValues: {
                name: userObject === null || userObject === void 0 ? void 0 : userObject.name,
                otp,
                expiresIn: 2,
            },
        });
        const tokenPayload = {
            userId: userObject === null || userObject === void 0 ? void 0 : userObject.id,
            email: userObject === null || userObject === void 0 ? void 0 : userObject.email,
            role: userObject === null || userObject === void 0 ? void 0 : userObject.role,
        };
        // generate a temporary token==>
        const tempToken = jsonwebtoken_1.default.sign(tokenPayload, env_1.envVars.JWT_ACCESS_SECRET, {
            expiresIn: '1d',
        });
        yield session.commitTransaction();
        session.endSession();
        return {
            token: tempToken,
        };
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
// verify otp==>
const verifyOtp = (otp, token) => __awaiter(void 0, void 0, void 0, function* () {
    const verifiedToken = jsonwebtoken_1.default.verify(token, env_1.envVars.JWT_ACCESS_SECRET);
    // throw error if the token is invalid==>
    if (!(verifiedToken === null || verifiedToken === void 0 ? void 0 : verifiedToken.userId)) {
        throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, 'Invalid Token Provided');
    }
    const isUserExist = yield user_model_1.User.findById(verifiedToken.userId);
    // throw error if the user doest not exist==>
    if (!isUserExist) {
        throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, 'User doest not exist');
    }
    const redisOtp = yield redis_config_1.redisClient.get(isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.email);
    // throw error if the otp is expired==>
    if (!redisOtp) {
        throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, 'OTP has expired please try resending a new otp');
    }
    const isOtpMatched = Number(otp) === Number(redisOtp);
    // throw error if the otp doest not match==>
    if (!isOtpMatched) {
        throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, 'Invalid Otp Provided');
    }
    // update the verified status==>
    yield user_model_1.User.findByIdAndUpdate(isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.id, { isVerified: true }, { runValidators: true });
});
// resend otp==>
const resendOtp = (token) => __awaiter(void 0, void 0, void 0, function* () {
    const verifiedToken = jsonwebtoken_1.default.verify(token, env_1.envVars.JWT_ACCESS_SECRET);
    // throw error if the token is invalid==>
    if (!(verifiedToken === null || verifiedToken === void 0 ? void 0 : verifiedToken.userId)) {
        throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, 'Invalid Token Provided');
    }
    const isUserExist = yield user_model_1.User.findById(verifiedToken.userId);
    // throw error if the user doest not exist==>
    if (!isUserExist) {
        throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, 'User doest not exist');
    }
    const hasPreviousOtp = yield redis_config_1.redisClient.get(isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.email);
    // throw error if the otp is already in the redis==>
    if (hasPreviousOtp) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, 'You cannot request for a new otp while your current otp is valid');
    }
    // generate a new otp==>
    const otp = (0, generateOtp_1.generateOtp)(6);
    // set a new otp==>
    yield redis_config_1.redisClient.set(isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.email, otp, {
        expiration: {
            type: 'EX',
            value: OTP_EXPIRATION,
        },
    });
    // send email==>
    yield (0, sendEmail_1.sendMail)({
        to: isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.email,
        subject: 'Account Verification OTP',
        templateName: 'send-otp',
        templateValues: {
            name: isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.name,
            otp,
            expiresIn: 2,
        },
    });
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
    const userObject = isExist.toObject();
    delete userObject.password;
    return Object.assign(Object.assign({}, userObject), { tokens });
});
// get access token==>
const getNewAccessToken = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    const tokens = yield (0, jwt_1.generateNewAccessToken)(refreshToken);
    return tokens;
});
// change password==>
const changePassword = (payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
    // find user==>
    const user = yield user_model_1.User.findById(userId);
    // throw error if the user is not exist==>
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, 'User not found');
    }
    // throw error if user don't have any password set==>
    if (!user.password) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, 'Please set your password first to do this action');
    }
    const isPasswordMatched = yield bcryptjs_1.default.compare(payload.oldPassword, user.password);
    // Throw error if the old password is incorrect==>
    if (!isPasswordMatched) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, 'Old password is incorrect');
    }
    const newPasswordIsSameAsOldPassword = yield bcryptjs_1.default.compare(payload.newPassword, user.password);
    // throw error if the new password is same as old password==>
    if (newPasswordIsSameAsOldPassword) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, 'New password cannot be same as old password');
    }
    user.password = yield bcryptjs_1.default.hash(payload.newPassword, Number(env_1.envVars.BCRYPT_SALT_ROUND));
    yield user.save();
});
// set password==>
const setPassword = (payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const user = yield user_model_1.User.findById(userId);
    // throw error if the user not found==>
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, 'User not found');
    }
    // throw error if the user set password already==>
    if (user.password) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, 'The password already set.You can change your password');
    }
    const hashedPassword = yield bcryptjs_1.default.hash(payload.password, Number(env_1.envVars.BCRYPT_SALT_ROUND));
    user.password = hashedPassword;
    const isGoogleUser = (_a = user === null || user === void 0 ? void 0 : user.auths) === null || _a === void 0 ? void 0 : _a.some((providerObj) => providerObj.provider === 'google');
    // add credentials in the auths if the user is google credentials user==>
    if (isGoogleUser) {
        user.auths = [
            ...user === null || user === void 0 ? void 0 : user.auths,
            {
                provider: 'credentials',
                providerId: user === null || user === void 0 ? void 0 : user.email,
            },
        ];
    }
    yield user.save();
});
// forget password==>
const forgetPassword = (email) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const isUserExist = yield user_model_1.User.findOne({ email });
    // throw error if the user doest not exist==>
    if (!isUserExist) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, 'User doest exist with this email');
    }
    const isGoogleUser = (_a = isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.auths) === null || _a === void 0 ? void 0 : _a.some((providerObj) => providerObj.provider === 'google');
    // throw error if the user is google authenticated and don't set the password yet==>
    if (isGoogleUser && !isUserExist.password) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, 'You are currently a google authenticated user and you cannot change your password.Try signing using google and you can add password');
    }
    const payload = {
        userId: isUserExist.id,
        email: isUserExist.email,
        role: isUserExist.role,
    };
    const temporaryToken = jsonwebtoken_1.default.sign(payload, env_1.envVars.JWT_ACCESS_SECRET, {
        expiresIn: '10m',
    });
    const resetUILink = `${env_1.envVars.FRONTEND_URL}/reset-password?user=${isUserExist.id}&token=${temporaryToken}`;
    yield (0, sendEmail_1.sendMail)({
        subject: 'Forget Password',
        templateName: 'forgetPassword',
        to: isUserExist.email,
        templateValues: {
            name: isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.name,
            resetUILink,
        },
    });
});
// reset password==>
const resetPassword = (payload, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, password } = payload;
    // throw error if the id is not same as the token==>
    if (id !== decodedToken.userId) {
        throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, 'Invalid Token or user id provided');
    }
    const isExist = yield user_model_1.User.findById(decodedToken.userId);
    // throw error if the user is not exist==>
    if (!isExist) {
        throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, 'User doest not exist');
    }
    const hashedPassword = yield bcryptjs_1.default.hash(password, Number(env_1.envVars.BCRYPT_SALT_ROUND));
    const updateUser = yield user_model_1.User.findOneAndUpdate({ _id: decodedToken.userId }, { password: hashedPassword }, { new: true }).select('-password');
    // throw error if any error occurs while changing the password==>
    if (!updateUser) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, 'Failed to update the password');
    }
});
exports.AuthServices = {
    credentialsLogin,
    verifyOtp,
    resendOtp,
    createUser,
    getNewAccessToken,
    resetPassword,
    setPassword,
    changePassword,
    forgetPassword,
};
