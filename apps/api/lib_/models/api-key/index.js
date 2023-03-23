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
var randomstring_1 = __importDefault(require("randomstring"));
var mongoose_1 = __importDefault(require("../../mongoose"));
var mongoose_created_1 = __importDefault(require("../../mongoose/plugins/mongoose-created"));
var mongoose_object_id_1 = __importDefault(require("../../mongoose/plugins/mongoose-object-id"));
var roll_1 = __importDefault(require("./methods/roll"));
var apiKeySchema = new mongoose_1["default"].Schema({
    user: {
        type: String,
        ref: 'User',
        immutable: true,
        validate: function (v) { return mongoose_1["default"].models.User.exists({ _id: v }); },
        required: true
    },
    name: {
        type: String,
        required: true
    },
    key: {
        type: String,
        "default": function () {
            return "sk_".concat(this.test ? 'test' : 'live', "_").concat(randomstring_1["default"].generate(64));
        }
    },
    last_used: {
        type: Date,
        "default": null,
        get: function (v) { return (v === null || v === void 0 ? void 0 : v.getTime()) || null; }
    }
});
apiKeySchema.methods.roll = roll_1["default"];
apiKeySchema.plugin((0, mongoose_object_id_1["default"])('ak', 'api_key'));
apiKeySchema.plugin(mongoose_created_1["default"]);
apiKeySchema.index({ key: 1 });
__exportStar(require("./types"), exports);
exports["default"] = mongoose_1["default"].models.ApiKey ||
    mongoose_1["default"].model('ApiKey', apiKeySchema);
