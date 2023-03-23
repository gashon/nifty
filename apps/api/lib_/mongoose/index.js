"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var mongoose_1 = __importDefault(require("mongoose"));
var mongoose_autopopulate_1 = __importDefault(require("mongoose-autopopulate"));
var mongoose_expand_1 = __importDefault(require("./plugins/mongoose-expand"));
var mongoose_hidden_1 = __importDefault(require("./plugins/mongoose-hidden"));
var mongoose_paginate_1 = __importDefault(require("./plugins/mongoose-paginate"));
mongoose_1["default"].plugin(mongoose_autopopulate_1["default"]);
mongoose_1["default"].plugin(mongoose_hidden_1["default"]);
mongoose_1["default"].plugin(mongoose_paginate_1["default"]);
mongoose_1["default"].plugin(mongoose_expand_1["default"]);
exports["default"] = mongoose_1["default"];
