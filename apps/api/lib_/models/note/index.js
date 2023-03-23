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
var noteSchema = new mongoose_1["default"].Schema({
    created_by: {
        type: mongoose_1["default"].Schema.Types.ObjectId,
        ref: "User",
        required: true,
        immutable: true
    },
    title: {
        type: String,
        trim: true,
        "default": "Note Title"
    },
    content: {
        type: String,
        "default": ""
    },
    description: {
        type: String,
        trim: true,
        required: false,
        sparse: true,
        "default": ""
    },
    collaborators: {
        type: [mongoose_1["default"].Schema.Types.ObjectId],
        "default": [],
        immutable: false,
        required: true,
        ref: "Collaborator"
    },
    directory: {
        type: mongoose_1["default"].Schema.Types.ObjectId,
        trim: true,
        ref: "Directory",
        required: false,
        immutable: false
    },
    img_url: {
        type: String,
        trim: true,
        "default": ""
    },
    tags: {
        type: [String],
        "default": []
    },
    is_public: {
        type: Boolean,
        "default": false
    },
    deleted_at: {
        type: Number,
        "default": null
    }
}, { timestamps: { updatedAt: "updated_at", createdAt: "created_at" } });
noteSchema.plugin((0, mongoose_object_id_1["default"])("note", "note"));
noteSchema.index({ created_by: 1, title: 1 }, { unique: true });
__exportStar(require("./types"), exports);
exports["default"] = mongoose_1["default"].models.Note ||
    mongoose_1["default"].model("Note", noteSchema);
