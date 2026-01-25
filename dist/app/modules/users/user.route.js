"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const user_schema_1 = require("./user.schema");
const user_interface_1 = require("./user.interface");
const checkAuth_1 = __importDefault(require("../../middlewares/checkAuth"));
const userRoutes = (0, express_1.Router)();
exports.userRoutes = userRoutes;
// create user==>
userRoutes.post('/register', (0, validateRequest_1.default)(user_schema_1.createUserSchema), user_controller_1.UserControllers.createUser);
// login==>
userRoutes.post('/login', (0, validateRequest_1.default)(user_schema_1.loginUserSchema), user_controller_1.UserControllers.loginUser);
// get all the users==>
userRoutes.get('/all-users', (0, checkAuth_1.default)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), user_controller_1.UserControllers.getAllUsers);
// update user==>
userRoutes.patch('/:id', (0, validateRequest_1.default)(user_schema_1.updateUserSchema), (0, checkAuth_1.default)(...Object.values(user_interface_1.Role)), user_controller_1.UserControllers.updateUser);
// delete user==>
userRoutes.delete('/:id', user_controller_1.UserControllers.deleteUser);
