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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var http_status_1 = __importDefault(require("http-status"));
var omit_1 = __importDefault(require("lodash/omit"));
var restHandlers = function (Schema, omitProperties) {
    if (omitProperties === void 0) { omitProperties = []; }
    return ({
        create: function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
            var item, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, Schema.create(__assign(__assign({}, (0, omit_1["default"])(req.body, __spreadArray(['_id'], omitProperties, true))), { user: res.locals.user.id }))];
                    case 1:
                        item = _a.sent();
                        res.send(item);
                        return [3 /*break*/, 3];
                    case 2:
                        err_1 = _a.sent();
                        next(err_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); },
        retrieve: function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
            var item, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, Schema.findOne(__assign(__assign({}, req.query), { _id: req.params.id, user: res.locals.user.id }))];
                    case 1:
                        item = _a.sent();
                        if (!item)
                            return [2 /*return*/, res.sendStatus(http_status_1["default"].NOT_FOUND)];
                        res.send(item);
                        return [3 /*break*/, 3];
                    case 2:
                        err_2 = _a.sent();
                        next(err_2);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); },
        update: function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
            var item, updatedItem, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, Schema.findOne({
                                _id: req.params.id,
                                user: res.locals.user.id
                            })];
                    case 1:
                        item = _a.sent();
                        if (!item)
                            return [2 /*return*/, res.sendStatus(http_status_1["default"].NOT_FOUND)];
                        return [4 /*yield*/, Schema.findOneAndUpdate({ _id: item.id }, (0, omit_1["default"])(req.body, __spreadArray([], omitProperties, true)), { "new": true, runValidators: true })];
                    case 2:
                        updatedItem = _a.sent();
                        res.send(updatedItem);
                        return [3 /*break*/, 4];
                    case 3:
                        err_3 = _a.sent();
                        next(err_3);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); },
        "delete": function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
            var item, err_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, Schema.findOneAndUpdate({
                                _id: req.params.id,
                                user: res.locals.user.id
                            }, { $set: { deleted_at: new Date().getTime() } })];
                    case 1:
                        item = _a.sent();
                        if (!item)
                            return [2 /*return*/, res.sendStatus(http_status_1["default"].NOT_FOUND)];
                        res.send(item);
                        return [3 /*break*/, 3];
                    case 2:
                        err_4 = _a.sent();
                        next(err_4);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); },
        list: function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
            var items, err_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, Schema.paginate(__assign(__assign({}, req.query), { user: res.locals.user.id }))];
                    case 1:
                        items = _a.sent();
                        res.send(items);
                        return [3 /*break*/, 3];
                    case 2:
                        err_5 = _a.sent();
                        next(err_5);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); }
    });
};
exports["default"] = restHandlers;
