"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DivisionRoutes = void 0;
const express_1 = require("express");
const checkAuth_1 = __importDefault(require("../../middlewares/checkAuth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const user_interface_1 = require("../users/user.interface");
const division_controller_1 = require("./division.controller");
const division_schema_1 = require("./division.schema");
const multer_config_1 = require("../../config/multer.config");
const router = (0, express_1.Router)();
// create division
router.post('/create', (0, checkAuth_1.default)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), multer_config_1.multerUpload.single('file'), (0, validateRequest_1.default)(division_schema_1.createDivisionSchema), division_controller_1.DivisionControllers.createDivision);
// get all division==>
router.get('/', division_controller_1.DivisionControllers.getAllDivisions);
// get single division==>
router.get('/:slug', division_controller_1.DivisionControllers.getSingleDivision);
// update division==>
router.patch('/:id', (0, checkAuth_1.default)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), multer_config_1.multerUpload.single('file'), (0, validateRequest_1.default)(division_schema_1.updateDivisionSchema), division_controller_1.DivisionControllers.updateDivision);
// delete division==>
router.delete('/:id', (0, checkAuth_1.default)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), division_controller_1.DivisionControllers.deleteDivision);
exports.DivisionRoutes = router;
