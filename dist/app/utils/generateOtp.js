"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOtp = void 0;
const crypto_1 = require("crypto");
const generateOtp = (length = 6) => {
    const min = 10 ** (length - 1);
    const max = 10 ** length;
    return (0, crypto_1.randomInt)(min, max).toString();
};
exports.generateOtp = generateOtp;
