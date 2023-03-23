"use strict";
exports.__esModule = true;
function parseJSON(json) {
    try {
        return JSON.parse(json);
    }
    catch (err) {
        return json;
    }
}
exports["default"] = parseJSON;
