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
exports.sendMail = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const nodemailer_1 = __importDefault(require("nodemailer"));
const AppError_1 = __importDefault(require("../errorHelpers/AppError"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const path_1 = __importDefault(require("path"));
const ejs_1 = __importDefault(require("ejs"));
const env_1 = require("../config/env");
const transporter = nodemailer_1.default.createTransport({
    secure: true,
    auth: {
        user: env_1.envVars.SMTP_USER,
        pass: env_1.envVars.SMTP_PASS,
    },
    port: Number(env_1.envVars.SMTP_PORT),
    host: env_1.envVars.SMTP_HOST,
});
const sendMail = (_a) => __awaiter(void 0, [_a], void 0, function* ({ to, subject, templateName, templateValues, }) {
    try {
        const templatePath = path_1.default.join(__dirname, 'templates', `${templateName}.ejs`);
        const html = yield ejs_1.default.renderFile(`${templatePath}`, templateValues);
        const email = yield transporter.sendMail({
            from: env_1.envVars.SMTP_FROM,
            to,
            subject,
            html,
        });
        console.log(`\u2709\uFE0F Email sent to ${to}: ${email.messageId}`);
    }
    catch (error) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, error.message || 'Failed to send email');
    }
});
exports.sendMail = sendMail;
