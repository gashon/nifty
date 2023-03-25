"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var mongoose_1 = __importDefault(require("lib/mongoose"));
var errorHandler = function errorHandler(err, req, res, next) {
    if (err instanceof SyntaxError) {
        console.log(err);
        res.status(400).send({
            error: {
                message: 'Invalid request (check your POST parameters): unable to parse JSON request body',
                type: 'invalid_request_error'
            }
        });
    }
    else if ((err.name === 'MongoError' || err.name === 'MongoServerError') && err.code === 11000) {
        console.log(err);
        var _a = Object.entries(err.keyValue)[0], path = _a[0], value = _a[1];
        res.status(400).send({
            error: {
                param: path,
                message: "Error, expected `".concat(path, "` to be unique. Value: `").concat(value, "`"),
                type: 'invalid_request_error'
            }
        });
    }
    else if (err instanceof mongoose_1["default"].Error.ValidationError) {
        console.log(err);
        res.status(400).send({
            error: {
                param: Object.keys(err.errors)[0],
                message: Object.values(err.errors)[0].message,
                type: 'invalid_request_error'
            }
        });
    }
    else if (err instanceof mongoose_1["default"].Error.CastError) {
        console.log(err);
        res.status(400).send({
            error: {
                param: err.path,
                message: err.message,
                type: 'invalid_request_error'
            }
        });
    }
    else {
        console.log(err);
        res.status(500).send({
            error: {
                message: 'Something went wrong on our end. Please open a ticket at <Nifty>',
                type: 'api_error'
            }
        });
    }
    next();
};
exports["default"] = errorHandler;
