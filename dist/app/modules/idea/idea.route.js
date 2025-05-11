"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ideaRoutes = void 0;
const express_1 = __importDefault(require("express"));
const idea_controller_1 = require("./idea.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const router = express_1.default.Router();
router.post("/", (0, auth_1.default)(), idea_controller_1.ideaController.createIdea);
router.get("/public/:ideaid", idea_controller_1.ideaController.getSingleIdeaPublic);
router.get("/my-ideas", (0, auth_1.default)(), idea_controller_1.ideaController.getMyIdeas);
router.get("/my-ideas/:id", (0, auth_1.default)(), idea_controller_1.ideaController.getSingleIdea);
router.get("/", idea_controller_1.ideaController.getAllIdeas);
router.patch("/:id", (0, auth_1.default)(), idea_controller_1.ideaController.updateIdea);
router.delete("/:id", (0, auth_1.default)(), idea_controller_1.ideaController.deleteIdea);
// get admin
router.get("/adminideas", idea_controller_1.ideaController.getIdeasForAdmin);
router.get("/adminideas/:id", (0, auth_1.default)(), idea_controller_1.ideaController.getSingleIdeaForAdmin);
router.patch("/:id/status", (0, auth_1.default)(), idea_controller_1.ideaController.updateIdeaStatus);
exports.ideaRoutes = router;
