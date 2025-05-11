"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryRoutes = void 0;
const express_1 = __importDefault(require("express"));
const category_controller_1 = require("./category.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const router = express_1.default.Router();
// Admin-only routes
router.post("/", (0, auth_1.default)(), category_controller_1.categoryController.createCategory);
router.patch("/:id", (0, auth_1.default)(), category_controller_1.categoryController.updateCategory);
router.delete("/:id", (0, auth_1.default)(), category_controller_1.categoryController.deleteCategory);
// Public route
router.get("/", category_controller_1.categoryController.getCategories);
router.get("/:id", category_controller_1.categoryController.getSingleCategory);
exports.categoryRoutes = router;
