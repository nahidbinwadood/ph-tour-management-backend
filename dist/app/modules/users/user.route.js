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
const userRoutes = (0, express_1.Router)();
exports.userRoutes = userRoutes;
userRoutes.post('/register', (0, validateRequest_1.default)(user_schema_1.createUserSchema), user_controller_1.UserControllers.createUser);
userRoutes.get('/all-users', user_controller_1.UserControllers.getAllUsers);
