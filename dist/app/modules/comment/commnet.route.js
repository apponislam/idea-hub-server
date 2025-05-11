"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentRoutes = void 0;
const express_1 = __importDefault(require("express"));
const comment_controller_1 = require("./comment.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const router = express_1.default.Router();
router.post("/:ideaId", (0, auth_1.default)(), comment_controller_1.commentController.createComment);
router.get("/:ideaId", comment_controller_1.commentController.getComments);
router.patch("/:commentId", (0, auth_1.default)(), comment_controller_1.commentController.updateComment);
router.delete("/:commentId", (0, auth_1.default)(), comment_controller_1.commentController.deleteComment);
exports.commentRoutes = router;
