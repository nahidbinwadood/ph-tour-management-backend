"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTransactionId = void 0;
const crypto_1 = require("crypto");
const getTransactionId = (userId) => {
    return `tran_${Date.now()}_${userId}_${(0, crypto_1.randomBytes)(16)}`;
};
exports.getTransactionId = getTransactionId;
