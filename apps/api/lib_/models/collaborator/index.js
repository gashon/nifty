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
var collaboratorSchema = new mongoose_1["default"].Schema({
    user: {
        type: mongoose_1["default"].Schema.Types.ObjectId,
        ref: "User",
        required: true,
        immutable: true
    },
    directory: {
        type: mongoose_1["default"].Schema.Types.ObjectId,
        ref: "Directory",
        required: false,
        immutable: true
    },
    note: {
        type: mongoose_1["default"].Schema.Types.ObjectId,
        ref: "Note",
        required: false,
        immutable: true
    },
    permissions: {
        type: [String],
        "default": [],
        immutable: false,
        required: true,
        "enum": ["read", "write", "delete"]
    },
    removed_at: {
        type: Number,
        "default": null
    }
}, { timestamps: { updatedAt: "updated_at", createdAt: "created_at" } });
collaboratorSchema.plugin((0, mongoose_object_id_1["default"])('col', 'collaborator'));
collaboratorSchema.index({ user: 1, note: 1 }, { unique: true });
__exportStar(require("./types"), exports);
exports["default"] = mongoose_1["default"].models.Collaborator ||
    mongoose_1["default"].model('Collaborator', collaboratorSchema);
