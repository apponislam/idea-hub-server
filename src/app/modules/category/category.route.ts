import express from "express";
import { categoryController } from "./category.controller";
import auth from "../../middlewares/auth";

const router = express.Router();

// Admin-only routes
router.post("/", auth(), categoryController.createCategory);
router.delete("/:id", auth(), categoryController.deleteCategory);

// Public route
router.get("/", categoryController.getCategories);

export const categoryRoutes = router;
