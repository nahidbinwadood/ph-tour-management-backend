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
exports.FileRoutes = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const express_1 = require("express");
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const saveImage_1 = require("../../utils/saveImage");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const router = (0, express_1.Router)();
// upload file==>
router.post('/upload', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const files = req.files;
    if (!files) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, 'Upload the file');
    }
    const asset = files === null || files === void 0 ? void 0 : files.file;
    if (!asset) {
        throw new AppError_1.default(400, 'Asset is missing');
    }
    const uploadFile = yield (0, saveImage_1.fileUp)(asset === null || asset === void 0 ? void 0 : asset.path);
    return res.status(201).json({ message: 'File uploaded', file: uploadFile });
}));
// get file==>
router.get('/:filename', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filename = req.params.filename;
    if (!filename) {
        throw new AppError_1.default(400, 'Filename is missing');
    }
    const filepath = path_1.default.join(saveImage_1.fileDir, filename);
    if (!(0, fs_1.existsSync)(filepath)) {
        throw new AppError_1.default(400, 'File is missing');
    }
    res.set('Cache-Control', 'public, max-age=31557600');
    res.status(200).sendFile(filepath);
}));
// delete file==>
router.delete('/:filename', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filename = req.params.filename;
    if (!filename) {
        throw new AppError_1.default(400, 'Filename is missing');
    }
    const filepath = path_1.default.join(saveImage_1.fileDir, filename);
    if (!(0, fs_1.existsSync)(filepath)) {
        throw new AppError_1.default(400, 'File is missing');
    }
    (0, fs_1.unlink)(filepath, (err) => {
        if (err) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, 'Failed to delete the file');
        }
    });
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: 'File deleted successfully',
    });
}));
exports.FileRoutes = router;
