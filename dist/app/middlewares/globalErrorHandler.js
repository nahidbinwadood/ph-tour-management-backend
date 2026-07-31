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
exports.globalErrorHandler = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const AppError_1 = __importDefault(require("../errorHelpers/AppError"));
const cloudinary_config_1 = require("../config/cloudinary.config");
const globalErrorHandler = (error, req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let statusCode = 500;
    let message = `Something went wrong`;
    let errorSources = [];
    // cleanup uploaded files on error; never let cleanup throw out of the handler==>
    try {
        // single==>
        if (req.file) {
            yield (0, cloudinary_config_1.deleteCloudinaryImage)(req.file.path);
        }
        // multiple==>
        if (req.files && Array.isArray(req.files) && !!req.files.length) {
            yield Promise.all(req.files.map((item) => (0, cloudinary_config_1.deleteCloudinaryImage)(item === null || item === void 0 ? void 0 : item.path)));
        }
    }
    catch (cleanupError) {
        console.error('Failed to cleanup uploaded files on error', cleanupError);
    }
    switch (true) {
        // App Error==>
        case error instanceof AppError_1.default: {
            statusCode = error.statusCode;
            message = error === null || error === void 0 ? void 0 : error.message;
            break;
        }
        // Mongoose errors (duplicate)==>
        case (error === null || error === void 0 ? void 0 : error.code) === 11000: {
            const duplicateValue = Object.values(error === null || error === void 0 ? void 0 : error.keyValue)[0];
            statusCode = http_status_codes_1.default.BAD_REQUEST;
            message = `${duplicateValue} already exists`;
            break;
        }
        // Object ID error Id error (Cast Error)=>
        case (error === null || error === void 0 ? void 0 : error.name) === 'CastError': {
            statusCode = http_status_codes_1.default.BAD_REQUEST;
            message = 'Invalid MongoDB ObjectID. Please provide a valid id';
            break;
        }
        // Mongoose Validation Error=>
        case (error === null || error === void 0 ? void 0 : error.name) === 'ValidationError': {
            const err = Object.values(error === null || error === void 0 ? void 0 : error.errors);
            const errItems = [];
            err === null || err === void 0 ? void 0 : err.forEach((item) => errItems === null || errItems === void 0 ? void 0 : errItems.push({
                path: item === null || item === void 0 ? void 0 : item.path,
                message: item === null || item === void 0 ? void 0 : item.message,
            }));
            errorSources = errItems;
            statusCode = http_status_codes_1.default.BAD_REQUEST;
            message = 'Validation Error';
            break;
        }
        // Zod Validation error==>
        case (error === null || error === void 0 ? void 0 : error.name) === 'ZodError': {
            const errItems = [];
            (_a = error === null || error === void 0 ? void 0 : error.issues) === null || _a === void 0 ? void 0 : _a.forEach((issue) => errItems === null || errItems === void 0 ? void 0 : errItems.push({
                path: issue === null || issue === void 0 ? void 0 : issue.path[issue.path.length - 1],
                message: issue === null || issue === void 0 ? void 0 : issue.message,
            }));
            statusCode = http_status_codes_1.default.BAD_REQUEST;
            message = 'Zod Error';
            errorSources = errItems;
            break;
        }
        // ========= JWT ERROR(Token Expiration)=============
        case error instanceof jsonwebtoken_1.default.TokenExpiredError: {
            statusCode = http_status_codes_1.default.UNAUTHORIZED;
            message = 'Session has expired. Please try with a new token';
            break;
        }
        // ========= JWT ERROR(Invalid Token)=============
        case error instanceof jsonwebtoken_1.default.JsonWebTokenError: {
            statusCode = http_status_codes_1.default.UNAUTHORIZED;
            message = 'Invalid token provided.';
            break;
        }
        case error instanceof Error: {
            statusCode = http_status_codes_1.default.INTERNAL_SERVER_ERROR;
            message = error.message || 'Internal Server Error';
            console.log('✓ Handled as Generic Error');
            break;
        }
    }
    res.status(statusCode).json(Object.assign(Object.assign(Object.assign({ status: false, statusCode,
        message }, (env_1.envVars.NODE_ENV == 'development' && !!(errorSources === null || errorSources === void 0 ? void 0 : errorSources.length)
        ? { errorSources }
        : {})), (env_1.envVars.NODE_ENV == 'development' ? { error } : {})), (env_1.envVars.NODE_ENV == 'development' ? { stack: error === null || error === void 0 ? void 0 : error.stack } : {})));
});
exports.globalErrorHandler = globalErrorHandler;
