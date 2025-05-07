import express from "express";
import { voteController } from "./vote.controller";
import auth from "../../middlewares/auth";

const router = express.Router();

// Protected routes
router.post("/:ideaId", auth(), voteController.vote);
router.get("/:ideaId", auth(), voteController.getVote);

export const voteRoutes = router;
