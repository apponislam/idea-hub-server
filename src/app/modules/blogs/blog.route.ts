import express from "express";
import { blogController } from "./blog.controller";
import auth from "../../middlewares/auth";

const router = express.Router();

router.post("/", auth(), blogController.createBlog);
router.get("/public/:blogId", blogController.getSingleBlogPublic);
router.get("/my-blogs", auth(), blogController.getMyBlogs);
router.get("/my-blogs/:id", auth(), blogController.getSingleBlog);

router.get("/", blogController.getAllBlogs);
router.patch("/:id", auth(), blogController.updateBlog);
router.delete("/:id", auth(), blogController.deleteBlog);

// Admin routes
router.get("/admin/blogs", auth(), blogController.getBlogsForAdmin);
router.get("/admin/blogs/:id", auth(), blogController.getSingleBlogForAdmin);

export const blogRoutes = router;
