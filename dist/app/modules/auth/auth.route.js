"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoute = void 0;
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("./auth.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const router = express_1.default.Router();
router.post("/login", auth_controller_1.authController.loginUser);
router.post("/refresh-token", auth_controller_1.authController.refreshToken);
router.get("/me", (0, auth_1.default)(), auth_controller_1.authController.getMe);
exports.authRoute = router;
