"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var mongoose_1 = __importDefault(require("mongoose"));
var qs_1 = __importDefault(require("qs"));
mongoose_1["default"].set('strictPopulate', false);
function mongooseExpand(schema) {
    function populate() {
        var expand = this.getQuery().expand;
        if (expand === undefined)
            return;
        var parsedExpand = Object.keys(qs_1["default"].parse(expand))[0] === '0'
            ? Object.values(qs_1["default"].parse(expand))
            : qs_1["default"].parse(expand);
        this.populate(parsedExpand);
        this.setQuery(__assign(__assign({}, this.getQuery()), { expand: undefined }));
    }
    schema.pre('find', populate);
    schema.pre('findOne', populate);
}
exports["default"] = mongooseExpand;
