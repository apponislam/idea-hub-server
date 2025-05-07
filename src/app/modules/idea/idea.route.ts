import express from "express";
import { ideaController } from "./idea.controller";

const router = express.Router();

router.post("/", auth(), ideaController.createIdea); // Protected route

export const ideaRoutes = router;
