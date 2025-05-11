"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.voteRoutes = void 0;
const express_1 = __importDefault(require("express"));
const vote_controller_1 = require("./vote.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const router = express_1.default.Router();
// Protected routes
router.post("/:ideaId", (0, auth_1.default)(), vote_controller_1.voteController.vote);
router.get("/:ideaId", (0, auth_1.default)(), vote_controller_1.voteController.getVote);
exports.voteRoutes = router;
