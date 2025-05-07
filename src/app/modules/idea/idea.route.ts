import express from "express";
import { ideaController } from "./idea.controller";
import auth from "../../middlewares/auth";

const router = express.Router();

router.post("/", auth(), ideaController.createIdea);

router.get("/", ideaController.getAllIdeas);

router.patch("/:id", auth(), ideaController.updateIdea);

router.delete("/:id", auth(), ideaController.deleteIdea);

export const ideaRoutes = router;
