"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoute = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const router = express_1.default.Router();
router.post("/register", user_controller_1.userController.createUser);
router.get("/", (0, auth_1.default)(), user_controller_1.userController.getAllUsers);
router.patch("/:userId/role", (0, auth_1.default)(), user_controller_1.userController.updateUserRole);
router.patch("/:userId/activate", (0, auth_1.default)(), user_controller_1.userController.activateUser);
router.patch("/:userId/deactivate", (0, auth_1.default)(), user_controller_1.userController.deactivateUser);
router.delete("/:userId/delete", (0, auth_1.default)(), user_controller_1.userController.deleteUser);
exports.userRoute = router;
