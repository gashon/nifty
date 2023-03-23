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
var md5_1 = __importDefault(require("md5"));
var mongoose_1 = __importDefault(require("../../mongoose"));
var mongoose_object_id_1 = __importDefault(require("../../mongoose/plugins/mongoose-object-id"));
var generate_token_1 = __importDefault(require("./methods/generate-token"));
var userSchema = new mongoose_1["default"].Schema({
    name: {
        type: String,
        trim: true,
        "default": function () {
            return this.email;
        }
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    avatar: {
        type: String,
        "default": function () {
            return (this.email &&
                "https://www.gravatar.com/avatar/".concat((0, md5_1["default"])(this.email), "?d=retro"));
        },
        trim: true
    },
    last_login: {
        type: Date,
        "default": null,
        get: function (v) { return (v === null || v === void 0 ? void 0 : v.getTime()) || null; }
    },
    admin: {
        type: Boolean,
        "default": false
    }
}, { timestamps: { updatedAt: "updated_at", createdAt: "created_at" } });
userSchema.methods.generateToken = generate_token_1["default"];
userSchema.plugin((0, mongoose_object_id_1["default"])('usr', 'user'));
userSchema.index({ email: 1 }, { unique: true });
__exportStar(require("./types"), exports);
exports["default"] = mongoose_1["default"].models.User ||
    mongoose_1["default"].model('User', userSchema);
