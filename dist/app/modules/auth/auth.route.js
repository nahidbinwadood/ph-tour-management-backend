"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const auth_schema_1 = require("./auth.schema");
const checkAuth_1 = __importDefault(require("../../middlewares/checkAuth"));
const user_interface_1 = require("../users/user.interface");
const passport_1 = __importDefault(require("passport"));
const env_1 = require("../../config/env");
const router = (0, express_1.Router)();
// create user==>
router.post('/register', (0, validateRequest_1.default)(auth_schema_1.createUserSchema), auth_controller_1.AuthControllers.createUser);
// verify otp==>
router.post('/verify-otp', (0, validateRequest_1.default)(auth_schema_1.verifyOtpSchema), auth_controller_1.AuthControllers.verifyOtp);
// resend otp==>
router.post('/resend-otp', (0, validateRequest_1.default)(auth_schema_1.resendOtpSchema), auth_controller_1.AuthControllers.resendOtp);
// credentials login==>
router.post('/login', (0, validateRequest_1.default)(auth_schema_1.loginSchema), auth_controller_1.AuthControllers.credentialsLogin);
// get refresh token==>
router.post('/refresh-token', auth_controller_1.AuthControllers.getNewAccessToken);
// logout==>
router.post('/logout', auth_controller_1.AuthControllers.logout);
// change password==>
router.post('/change-password', (0, checkAuth_1.default)(...Object.values(user_interface_1.Role)), (0, validateRequest_1.default)(auth_schema_1.changePasswordSchema), auth_controller_1.AuthControllers.changePassword);
// set password==>
router.post('/set-password', (0, checkAuth_1.default)(...Object.values(user_interface_1.Role)), (0, validateRequest_1.default)(auth_schema_1.setPasswordSchema), auth_controller_1.AuthControllers.setPassword);
// forget password==>
router.post('/forget-password', (0, validateRequest_1.default)(auth_schema_1.forgetPasswordSchema), auth_controller_1.AuthControllers.forgetPassword);
// reset password==>
router.post('/reset-password', (0, validateRequest_1.default)(auth_schema_1.resetPasswordSchema), (0, checkAuth_1.default)(...Object.values(user_interface_1.Role)), auth_controller_1.AuthControllers.resetPassword);
// google verify==>
router.get('/google', (req, res, next) => {
    var _a;
    const redirect = ((_a = req.query) === null || _a === void 0 ? void 0 : _a.redirect) || '';
    passport_1.default.authenticate('google', {
        scope: ['profile', 'email'],
        state: redirect,
    })(req, res, next);
});
// google redirect==>
router.get('/google/callback', passport_1.default.authenticate('google', {
    failureRedirect: `${env_1.envVars.FRONTEND_URL}/login?error=Something_went_wrong.Please_contact_support`,
}), auth_controller_1.AuthControllers.googleCallback);
exports.AuthRoutes = router;
