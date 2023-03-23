"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var omit_1 = __importDefault(require("lodash/omit"));
function mongooseHidden(schema) {
    schema.set('toObject', {
        getters: true,
        virtuals: true,
        useProjection: true,
        transform: function (_, obj) { return (0, omit_1["default"])(obj, ['__v', '_id']); }
    });
    schema.set('toJSON', {
        getters: true,
        virtuals: true,
        useProjection: true,
        transform: function (_, obj) { return (0, omit_1["default"])(obj, ['__v', '_id']); }
    });
}
exports["default"] = mongooseHidden;
