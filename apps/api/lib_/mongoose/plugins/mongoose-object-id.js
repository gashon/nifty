"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var generate_id_1 = __importDefault(require("../../helpers/generate-id"));
function mongooseObjectId(prefix, objectName) {
    return function (schema) {
        schema.add({
            _id: {
                type: String,
                "default": function () { return (0, generate_id_1["default"])(prefix); }
            }
        });
        schema.virtual('object').get(function () { return objectName; });
    };
}
exports["default"] = mongooseObjectId;
