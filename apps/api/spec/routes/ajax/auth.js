"use strict";
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
var express_1 = __importDefault(require("express"));
var http_status_1 = __importDefault(require("http-status"));
var notification_1 = __importDefault(require("lib/models/notification"));
var token_1 = __importDefault(require("lib/models/token"));
var user_1 = __importDefault(require("lib/models/user"));
var passport_1 = __importDefault(require("../../lib/passport"));
var router = express_1["default"].Router();
router.post('/login/email', function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var user, token, loginLink, err_1;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 6, , 7]);
                return [4 /*yield*/, user_1["default"].findOne({ email: req.body.email })];
            case 1:
                user = _b.sent();
                if (!!user) return [3 /*break*/, 3];
                return [4 /*yield*/, user_1["default"].create({ email: req.body.email })];
            case 2:
                user = _b.sent();
                _b.label = 3;
            case 3: return [4 /*yield*/, token_1["default"].create({ user: user.id, strategy: 'email' })];
            case 4:
                token = _b.sent();
                loginLink = token.getLoginLink(((_a = req.query.redirect) === null || _a === void 0 ? void 0 : _a.toString()) || '/d');
                return [4 /*yield*/, notification_1["default"].create({
                        type: 'login',
                        emails: [req.body.email],
                        data: { login_link: loginLink.toString() }
                    })];
            case 5:
                _b.sent();
                res.sendStatus(200);
                return [3 /*break*/, 7];
            case 6:
                err_1 = _b.sent();
                next(err_1);
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); });
router.get('/login/google', function (req, res, next) {
    var _a;
    passport_1["default"].authenticate('google', {
        scope: ['email', 'profile'],
        session: false,
        state: JSON.stringify({
            redirect: (_a = req.query.redirect) === null || _a === void 0 ? void 0 : _a.toString()
        })
    })(req, res, next);
});
router.get('/login/google/callback', function (req, res, next) {
    next();
}, passport_1["default"].authenticate('google', {
    session: false,
    failureRedirect: "".concat(process.env.DASHBOARD_BASE_URL, "/auth/login")
}), function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var state, user, token, loginLink, err_2;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                state = req.query.state && JSON.parse(req.query.state.toString());
                user = req.user;
                if (!user)
                    return [2 /*return*/, res.redirect("".concat(process.env.DASHBOARD_BASE_URL, "/auth/login"))];
                return [4 /*yield*/, token_1["default"].create({ user: user.id, strategy: 'google' })];
            case 1:
                token = _b.sent();
                loginLink = new URL("".concat(process.env.DASHBOARD_BASE_URL, "/auth/login"));
                loginLink.searchParams.append('token', token.id);
                loginLink.searchParams.append('redirect', encodeURIComponent(((_a = state.redirect) === null || _a === void 0 ? void 0 : _a.toString()) || '/query'));
                res.redirect(loginLink.toString());
                return [3 /*break*/, 3];
            case 2:
                err_2 = _b.sent();
                next(err_2);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/recycle', function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var oldToken, newToken, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                return [4 /*yield*/, token_1["default"].findById(req.body.authorization)];
            case 1:
                oldToken = _a.sent();
                if (!oldToken)
                    return [2 /*return*/, res.sendStatus(http_status_1["default"].UNAUTHORIZED)];
                return [4 /*yield*/, token_1["default"].create({
                        user: oldToken.user,
                        strategy: oldToken.strategy
                    })];
            case 2:
                newToken = _a.sent();
                return [4 /*yield*/, user_1["default"].findByIdAndUpdate(oldToken.user, { last_login: Date.now() })];
            case 3:
                _a.sent();
                return [4 /*yield*/, oldToken.deleteOne()];
            case 4:
                _a.sent();
                res.send({ authorization: newToken.id });
                return [3 /*break*/, 6];
            case 5:
                err_3 = _a.sent();
                next(err_3);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
router.get('/user', function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var token, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                console.log("GOT", req.cookies.authorization);
                return [4 /*yield*/, token_1["default"].findById(req.cookies.authorization).populate('user')];
            case 1:
                token = _a.sent();
                if (!token)
                    return [2 /*return*/, res.sendStatus(http_status_1["default"].UNAUTHORIZED)];
                res.send(token.user);
                return [3 /*break*/, 3];
            case 2:
                err_4 = _a.sent();
                next(err_4);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
exports["default"] = router;
