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
var send_email_1 = __importDefault(require("./middleware/send-email"));
var notificationSchema = new mongoose_1["default"].Schema({
    user: {
        type: String,
        ref: 'User',
        immutable: true,
        validate: function (v) { return mongoose_1["default"].models.User.exists({ _id: v }); }
    },
    type: {
        type: String,
        "enum": ['login', 'team.invite'],
        immutable: true
    },
    data: {
        type: Object,
        immutable: true,
        required: true
    },
    emails: {
        type: [
            {
                type: String,
                required: true
            },
        ],
        "default": [],
        required: true
    }
}, { timestamps: { updatedAt: "updated_at", createdAt: "created_at" } });
notificationSchema.plugin((0, mongoose_object_id_1["default"])('ntf', 'notification'));
notificationSchema.post('save', send_email_1["default"]);
notificationSchema.index({ user: 1, type: 1 });
notificationSchema.index({ type: 1, emails: 1 });
notificationSchema.index({ 'data.invoice': 1 });
__exportStar(require("./types"), exports);
exports["default"] = mongoose_1["default"].models.Notification ||
    mongoose_1["default"].model('Notification', notificationSchema);
