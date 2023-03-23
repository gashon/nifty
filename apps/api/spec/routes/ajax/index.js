"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var express_1 = __importDefault(require("express"));
var auth_1 = __importDefault(require("./auth"));
var router = express_1["default"].Router();
router.use('/auth', auth_1["default"]);
// router.use('/files', files);
// router.use('/apikeys', apiKeys);
exports["default"] = router;
