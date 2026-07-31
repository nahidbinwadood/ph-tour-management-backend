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
exports.fileDir = exports.ALLOWED_FILES_EXTENSIONS = void 0;
exports.fileUp = fileUp;
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
// import { v4 as uuidv4 } from "uuid";
const crypto_1 = require("crypto");
// include all the files extensions that are allowed to upload.
exports.ALLOWED_FILES_EXTENSIONS = [];
exports.fileDir = path_1.default.join(process.cwd(), "files");
if (!(0, fs_1.existsSync)(exports.fileDir))
    (0, fs_1.mkdirSync)(exports.fileDir);
// Use the function to upload files locally
function fileUp(link) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!link)
            return null;
        const extIndex = link.lastIndexOf(".");
        if (extIndex === -1)
            throw new Error("Link does not contain a file extension.");
        const ext = link.substring(extIndex + 1);
        // if (!ALLOWED_FILES_EXTENSIONS.includes(ext.toLowerCase()))
        //   throw new Error("Invalid file extension.");
        const fileName = (0, crypto_1.randomBytes)(16).toString('hex') + "." + ext;
        const buffer = (0, fs_1.readFileSync)(link);
        const filePath = path_1.default.join(exports.fileDir, fileName);
        (0, fs_1.writeFileSync)(filePath, buffer);
        return fileName;
    });
}
