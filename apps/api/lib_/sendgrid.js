"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var mail_1 = __importDefault(require("@sendgrid/mail"));
mail_1["default"].setApiKey(process.env.SENDGRID_API_KEY);
exports["default"] = mail_1["default"];
