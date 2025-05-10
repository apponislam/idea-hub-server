import express from "express";
import { ideaController } from "./idea.controller";
import auth from "../../middlewares/auth";

const router = express.Router();

router.post("/", auth(), ideaController.createIdea);

router.get("/my-ideas", auth(), ideaController.getMyIdeas);

router.get("/my-ideas/:id", auth(), ideaController.getSingleIdea);

router.get("/", ideaController.getAllIdeas);

router.patch("/:id", auth(), ideaController.updateIdea);

router.delete("/:id", auth(), ideaController.deleteIdea);

// get admin

router.get("/adminideas", ideaController.getIdeasForAdmin);
router.patch("/:id/status", auth(), ideaController.updateIdeaStatus);

export const ideaRoutes = router;
