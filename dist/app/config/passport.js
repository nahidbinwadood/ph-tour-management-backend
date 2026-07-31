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
/* eslint-disable @typescript-eslint/no-explicit-any */
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const passport_local_1 = require("passport-local");
const user_interface_1 = require("../modules/users/user.interface");
const user_model_1 = require("../modules/users/user.model");
const env_1 = require("./env");
// local strategy==>
passport_1.default.use(new passport_local_1.Strategy({ usernameField: 'email', passwordField: 'password' }, (email, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isUserExist = yield user_model_1.User.findOne({ email });
        if (!isUserExist) {
            return done('User not exist');
        }
        const isGoogleAuthenticated = isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.auths.some((provider) => provider.provider === 'google');
        // throw error if the user is google authenticated==>
        if (isGoogleAuthenticated && !isUserExist.password) {
            return done(null, false, {
                message: 'You have authenticated through Google. So if you want to login with credentials, then at first login with google and set a password for your Gmail and then you can login with email and password.',
            });
        }
        const isPasswordMatched = yield bcryptjs_1.default.compare(password, isUserExist.password);
        // throw error if the password is not matched==>
        if (!isPasswordMatched) {
            return done(null, false, {
                message: 'The email or password is not correct',
            });
        }
        // throw error if the user is not verified==>
        if (!isUserExist.isVerified) {
            return done(null, false, {
                message: 'User is not verified',
            });
        }
        // throw error if the user is inactive or blocked==>
        if (isUserExist.isActive === user_interface_1.IsActive.BLOCKED ||
            isUserExist.isActive === user_interface_1.IsActive.INACTIVE) {
            return done(null, false, {
                message: `User is ${isUserExist.isActive}`,
            });
        }
        // throw error if the user is deleted==>
        if (isUserExist.isDeleted) {
            return done(null, false, {
                message: `User is deleted`,
            });
        }
        return done(null, isUserExist);
    }
    catch (error) {
        done(error);
    }
})));
// google strategy==>
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: env_1.envVars.GOOGLE_CLIENT_ID,
    clientSecret: env_1.envVars.GOOGLE_CLIENT_SECRET,
    callbackURL: env_1.envVars.GOOGLE_CALLBACK_URL,
}, (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const email = (_b = (_a = profile === null || profile === void 0 ? void 0 : profile.emails) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.value;
        if (!email) {
            return done(null, false, { message: 'Email Not Found' });
        }
        let user = yield user_model_1.User.findOne({ email });
        if (!user) {
            user = yield user_model_1.User.create({
                name: profile === null || profile === void 0 ? void 0 : profile.displayName,
                email,
                picture: (_c = profile === null || profile === void 0 ? void 0 : profile.photos) === null || _c === void 0 ? void 0 : _c[0].value,
                role: user_interface_1.Role.USER,
                isVerified: true,
                auths: [
                    {
                        provider: 'google',
                        providerId: profile === null || profile === void 0 ? void 0 : profile.id,
                    },
                ],
            });
        }
        // throw error if the user is not verified==>
        if (!user.isVerified) {
            return done(null, false, {
                message: 'User is not verified',
            });
        }
        // throw error if the user is inactive or blocked==>
        if (user.isActive === user_interface_1.IsActive.BLOCKED ||
            user.isActive === user_interface_1.IsActive.INACTIVE) {
            return done(null, false, {
                message: `User is ${user.isActive}`,
            });
        }
        // throw error if the user is deleted==>
        if (user.isDeleted) {
            return done(null, false, {
                message: `User is deleted`,
            });
        }
        done(null, user);
    }
    catch (error) {
        console.log(error);
        done(error);
    }
})));
passport_1.default.serializeUser((user, done) => {
    done(null, user === null || user === void 0 ? void 0 : user._id);
});
passport_1.default.deserializeUser((id, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.User.findById(id);
        done(null, user);
    }
    catch (error) {
        console.log(error);
        done(error);
    }
}));
