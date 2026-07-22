"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sendResponse = (res, responseData) => {
    const { statusCode, success, message, data, token, meta } = responseData;
    return res.status(statusCode).json({
        statusCode,
        success,
        message,
        data,
        token,
        meta,
    });
};
exports.default = sendResponse;
