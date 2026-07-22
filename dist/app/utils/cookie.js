"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeCookie = exports.setAuthCookie = exports.setCookie = void 0;
const setCookie = (res, cookieName, value) => {
    res.cookie(cookieName, value, {
        httpOnly: true,
        secure: false,
    });
};
exports.setCookie = setCookie;
const setAuthCookie = (res, tokens) => {
    if (tokens === null || tokens === void 0 ? void 0 : tokens.accessToken) {
        res.cookie('accessToken', tokens === null || tokens === void 0 ? void 0 : tokens.accessToken, {
            httpOnly: true,
            secure: false,
        });
    }
    if (tokens === null || tokens === void 0 ? void 0 : tokens.refreshToken) {
        res.cookie('refreshToken', tokens === null || tokens === void 0 ? void 0 : tokens.refreshToken, {
            httpOnly: true,
            secure: false,
        });
    }
};
exports.setAuthCookie = setAuthCookie;
const removeCookie = (res, cookiesName) => {
    cookiesName === null || cookiesName === void 0 ? void 0 : cookiesName.forEach((cookie) => res.clearCookie(cookie, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
    }));
};
exports.removeCookie = removeCookie;
