"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.USER_PERMISSIONS = exports.REFRESH_TOKEN_EXPIRATION_IN_SECONDS = exports.ACCESS_TOKEN_EXPIRATION_IN_SECONDS = void 0;
exports.ACCESS_TOKEN_EXPIRATION_IN_SECONDS = 60 * 60 * 24 * 1; // 1 days
exports.REFRESH_TOKEN_EXPIRATION_IN_SECONDS = 60 * 60 * 24 * 14; // 14 days
exports.USER_PERMISSIONS = {
    BETA_TESTER: 'beta-tester',
    EARLY_ACCESS: 'early-access',
    GENERAL: 'general',
};
