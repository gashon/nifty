"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var mongoose_1 = __importDefault(require("../../mongoose"));
var mongoose_object_id_1 = __importDefault(require("../../mongoose/plugins/mongoose-object-id"));
var get_login_link_1 = __importDefault(require("./methods/get-login-link"));
var tokenSchema = new mongoose_1["default"].Schema({
    user: {
        type: String,
        ref: 'User',
        required: true,
        immutable: true
    },
    strategy: {
        type: String,
        "default": 'email',
        "enum": ['google', 'email', 'invite']
    }
}, { timestamps: { updatedAt: "updated_at", createdAt: "created_at" } });
tokenSchema.methods.getLoginLink = get_login_link_1["default"];
tokenSchema.plugin((0, mongoose_object_id_1["default"])('tkn', 'token'));
__exportStar(require("./types"), exports);
exports["default"] = mongoose_1["default"].models.Token || mongoose_1["default"].model('Token', tokenSchema);
