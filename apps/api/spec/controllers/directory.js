"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var express = __importStar(require("express"));
var directory_1 = __importDefault(require("lib/models/directory"));
var tsoa_1 = require("tsoa");
var rest_handlers_1 = __importDefault(require("../helpers/rest-handlers"));
var handlers = (0, rest_handlers_1["default"])(directory_1["default"]);
console.log("Controller undefined:", express, tsoa_1.Controller, tsoa_1.Delete, tsoa_1.Get, tsoa_1.Inject, tsoa_1.OperationId, tsoa_1.Patch, tsoa_1.Path, tsoa_1.Post, tsoa_1.Query, tsoa_1.Response, tsoa_1.Route, tsoa_1.Tags);
var DirectoryController = /** @class */ (function (_super) {
    __extends(DirectoryController, _super);
    function DirectoryController() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DirectoryController.prototype.create = function (body, req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, handlers.create(req, res, next)];
            });
        });
    };
    DirectoryController.prototype.retrieve = function (id, query, req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, handlers.retrieve(req, res, next)];
            });
        });
    };
    DirectoryController.prototype.update = function (id, body, req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, handlers.update(req, res, next)];
            });
        });
    };
    DirectoryController.prototype["delete"] = function (id, req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, handlers["delete"](req, res, next)];
            });
        });
    };
    DirectoryController.prototype.list = function (query, req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, handlers.list(req, res, next)];
            });
        });
    };
    __decorate([
        (0, tsoa_1.Post)(),
        (0, tsoa_1.OperationId)('directory_create'),
        (0, tsoa_1.Response)(201, 'Created'),
        (0, tsoa_1.Response)(400, 'Bad Request'),
        (0, tsoa_1.Response)(401, 'Unauthorized'),
        __param(0, (0, tsoa_1.Body)()),
        __param(1, (0, tsoa_1.Inject)()),
        __param(2, (0, tsoa_1.Inject)()),
        __param(3, (0, tsoa_1.Inject)())
    ], DirectoryController.prototype, "create");
    __decorate([
        (0, tsoa_1.Get)('{id}'),
        (0, tsoa_1.OperationId)('directory_retrieve'),
        (0, tsoa_1.Response)(200, 'OK'),
        (0, tsoa_1.Response)(400, 'Bad Request'),
        (0, tsoa_1.Response)(401, 'Unauthorized'),
        (0, tsoa_1.Response)(404, 'Not Found'),
        __param(0, (0, tsoa_1.Path)()),
        __param(1, (0, tsoa_1.Query)()),
        __param(2, (0, tsoa_1.Inject)()),
        __param(3, (0, tsoa_1.Inject)()),
        __param(4, (0, tsoa_1.Inject)())
    ], DirectoryController.prototype, "retrieve");
    __decorate([
        (0, tsoa_1.Patch)('{id}'),
        (0, tsoa_1.OperationId)('directory_update'),
        (0, tsoa_1.Response)(200, 'OK'),
        (0, tsoa_1.Response)(400, 'Bad Request'),
        (0, tsoa_1.Response)(401, 'Unauthorized'),
        (0, tsoa_1.Response)(404, 'Not Found'),
        __param(0, (0, tsoa_1.Path)()),
        __param(1, (0, tsoa_1.Body)()),
        __param(2, (0, tsoa_1.Inject)()),
        __param(3, (0, tsoa_1.Inject)()),
        __param(4, (0, tsoa_1.Inject)())
    ], DirectoryController.prototype, "update");
    __decorate([
        (0, tsoa_1.Delete)('{id}'),
        (0, tsoa_1.OperationId)('directory_delete'),
        (0, tsoa_1.Response)(204, 'No Content'),
        (0, tsoa_1.Response)(400, 'Bad Request'),
        (0, tsoa_1.Response)(401, 'Unauthorized'),
        (0, tsoa_1.Response)(404, 'Not Found'),
        __param(0, (0, tsoa_1.Path)()),
        __param(1, (0, tsoa_1.Inject)()),
        __param(2, (0, tsoa_1.Inject)()),
        __param(3, (0, tsoa_1.Inject)())
    ], DirectoryController.prototype, "delete");
    __decorate([
        (0, tsoa_1.Get)(),
        (0, tsoa_1.OperationId)('directory_list'),
        (0, tsoa_1.Response)(200, 'OK'),
        (0, tsoa_1.Response)(400, 'Bad Request'),
        (0, tsoa_1.Response)(401, 'Unauthorized'),
        __param(0, (0, tsoa_1.Query)()),
        __param(1, (0, tsoa_1.Inject)()),
        __param(2, (0, tsoa_1.Inject)()),
        __param(3, (0, tsoa_1.Inject)())
    ], DirectoryController.prototype, "list");
    DirectoryController = __decorate([
        (0, tsoa_1.Route)('directories'),
        (0, tsoa_1.Tags)('Directory')
    ], DirectoryController);
    return DirectoryController;
}(tsoa_1.Controller));
exports["default"] = new DirectoryController();
