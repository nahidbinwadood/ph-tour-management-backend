"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
const AppError_1 = __importDefault(require("../errorHelpers/AppError"));
const server_1 = __importDefault(require("../../server"));
const zod_1 = require("zod");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const globalErrorHandler = (error, req, res, next) => {
    var _a;
    let statusCode = 500;
    let message = `Something went wrong`;
    if (error instanceof AppError_1.default) {
        statusCode = error === null || error === void 0 ? void 0 : error.statusCode;
        message = error === null || error === void 0 ? void 0 : error.message;
    }
    else {
        message = error === null || error === void 0 ? void 0 : error.message;
    }
    if (error instanceof zod_1.ZodError) {
        statusCode = http_status_codes_1.default.BAD_REQUEST;
        message = 'Validation Error';
        const formattedError = (_a = error === null || error === void 0 ? void 0 : error.issues) === null || _a === void 0 ? void 0 : _a.reduce((acc, er) => {
            const path = er === null || er === void 0 ? void 0 : er.path.join('.');
            acc[path] = er === null || er === void 0 ? void 0 : er.message;
            return acc;
        }, {});
        error = formattedError;
    }
    res.status(statusCode).json({
        status: false,
        statusCode,
        message,
        error,
        stack: server_1.default.NODE_ENV == 'development' ? error === null || error === void 0 ? void 0 : error.stack : null,
    });
};
exports.globalErrorHandler = globalErrorHandler;
