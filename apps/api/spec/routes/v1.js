"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var express_1 = __importDefault(require("express"));
var auth_1 = __importDefault(require("../middleware/auth"));
var directory_1 = __importDefault(require("../controllers/directory"));
var router = express_1["default"].Router();
router.post('/datasets', auth_1["default"], directory_1["default"].create);
// router.get('/datasets/:id', auth, directory.retrieve);
// router.patch('/datasets/:id', auth, directory.update);
// router.delete('/datasets/:id', auth, directory.delete);
// router.get('/datasets', auth, directory.list);
exports["default"] = router;
