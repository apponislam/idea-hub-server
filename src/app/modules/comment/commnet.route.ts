import express from "express";
import { commentController } from "./comment.controller";
import auth from "../../middlewares/auth";

const router = express.Router();

router.post("/:ideaId", auth(), commentController.createComment);

router.get("/:ideaId", commentController.getComments);

router.patch("/:commentId", auth(), commentController.updateComment);

router.delete("/:commentId", auth(), commentController.deleteComment);

export const commentRoutes = router;
