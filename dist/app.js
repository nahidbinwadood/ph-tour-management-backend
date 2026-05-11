"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_1 = __importDefault(require("express"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const globalErrorHandler_1 = require("./app/middlewares/globalErrorHandler");
const notFound_1 = __importDefault(require("./app/middlewares/notFound"));
const routes_1 = __importDefault(require("./app/routes"));
const app = (0, express_1.default)();
// parser==>
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
// routes==>
app.use('/api/v1', routes_1.default);
app.get('/', (req, res) => {
    res.status(http_status_codes_1.default.OK).json({
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: 'The server is running',
    });
});
// not found error==>
app.use(notFound_1.default);
exports.default = app;
// global error==>
app.use(globalErrorHandler_1.globalErrorHandler);
