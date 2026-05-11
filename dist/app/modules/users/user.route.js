"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = require("express");
const checkAuth_1 = __importDefault(require("../../middlewares/checkAuth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const user_controller_1 = require("./user.controller");
const user_interface_1 = require("./user.interface");
const user_schema_1 = require("./user.schema");
const router = (0, express_1.Router)();
// get all the users==>
router.get('/all-users', (0, checkAuth_1.default)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), user_controller_1.UserControllers.getAllUsers);
// update user==>
router.patch('/:id', (0, validateRequest_1.default)(user_schema_1.updateUserSchema), (0, checkAuth_1.default)(...Object.values(user_interface_1.Role)), user_controller_1.UserControllers.updateUser);
// delete user==>
router.delete('/:id', (0, checkAuth_1.default)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), user_controller_1.UserControllers.deleteUser);
exports.UserRoutes = router;
