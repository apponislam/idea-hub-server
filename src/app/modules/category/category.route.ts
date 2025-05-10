import express from "express";
import { categoryController } from "./category.controller";
import auth from "../../middlewares/auth";

const router = express.Router();

// Admin-only routes
router.post("/", auth(), categoryController.createCategory);
router.patch("/:id", auth(), categoryController.updateCategory);
router.delete("/:id", auth(), categoryController.deleteCategory);

// Public route
router.get("/", categoryController.getCategories);
router.get("/:id", categoryController.getSingleCategory);

export const categoryRoutes = router;
