"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.multerUpload = void 0;
const multer_1 = __importDefault(require("multer"));
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const cloudinary_config_1 = require("./cloudinary.config");
const storage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_config_1.CloudinaryConfig,
    params: {
        public_id: (req, file) => {
            var _a;
            const originalFileName = (_a = file === null || file === void 0 ? void 0 : file.originalname) === null || _a === void 0 ? void 0 : _a.toLocaleLowerCase().replace(' ', '_').replace(/[^a-z0-9\-.]/g, '').split('.').slice(0, -1).join('_');
            const uniqueName = `${Math.random().toString(36).substring(2)}_${Date.now()}_${originalFileName}`;
            return uniqueName;
        },
    },
});
exports.multerUpload = (0, multer_1.default)({ storage });
