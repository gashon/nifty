"use strict";
exports.__esModule = true;
var nanoid_1 = require("nanoid");
function generateId(prefix, size) {
    var nanoid = (0, nanoid_1.customAlphabet)('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', size || 21);
    return "".concat(prefix, "_").concat(nanoid());
}
exports["default"] = generateId;
