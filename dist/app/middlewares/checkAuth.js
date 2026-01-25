"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AppError_1 = __importDefault(require("../errorHelpers/AppError"));
const env_1 = require("../config/env");
const jwt_1 = require("../utils/jwt");
const checkAuth = (...authRoles) => (req, res, next) => {
    var _a;
    try {
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
        if (!token)
            throw new AppError_1.default(403, 'No authorization token found');
        const verifiedToken = (0, jwt_1.verifyToken)(token, env_1.envVars.JWT_SECRET);
        if (!verifiedToken)
            throw new AppError_1.default(403, 'You are not authorized');
        const verifyRole = authRoles.includes(verifiedToken === null || verifiedToken === void 0 ? void 0 : verifiedToken.role);
        if (!verifyRole)
            throw new AppError_1.default(401, 'You are not allowed to access this feature');
        req.user = verifiedToken;
        next();
    }
    catch (error) {
        console.log(error);
        next(error);
    }
};
exports.default = checkAuth;
