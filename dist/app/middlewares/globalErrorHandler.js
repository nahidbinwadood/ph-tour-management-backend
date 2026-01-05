"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
const env_1 = require("../config/env");
const AppError_1 = __importDefault(require("../errorHelpers/AppError"));
const globalErrorHandler = (error, req, res, next) => {
    let statusCode = 500;
    let message = `Something went wrong`;
    if (error instanceof AppError_1.default) {
        statusCode = error === null || error === void 0 ? void 0 : error.statusCode;
        message = error === null || error === void 0 ? void 0 : error.message;
    }
    else {
        message = error === null || error === void 0 ? void 0 : error.message;
    }
    res.status(statusCode).json({
        status: false,
        message,
        error,
        stack: env_1.envVars.NODE_ENV == 'development' ? error === null || error === void 0 ? void 0 : error.stack : null,
    });
};
exports.globalErrorHandler = globalErrorHandler;
