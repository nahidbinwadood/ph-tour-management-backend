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
const router = (0, express_1.Router)();
// create user==>
router.post('/register', (0, validateRequest_1.default)(auth_schema_1.createUserSchema), auth_controller_1.AuthControllers.createUser);
// credentials login==>
router.post('/login', (0, validateRequest_1.default)(auth_schema_1.loginSchema), auth_controller_1.AuthControllers.credentialsLogin);
// get refresh token==>
router.post('/refresh-token', auth_controller_1.AuthControllers.getNewAccessToken);
// logout==>
router.post('/logout', auth_controller_1.AuthControllers.logout);
// reset password==>
router.post('/reset-password', (0, validateRequest_1.default)(auth_schema_1.changePasswordSchema), (0, checkAuth_1.default)(...Object.values(user_interface_1.Role)), auth_controller_1.AuthControllers.resetPassword);
exports.AuthRoutes = router;
