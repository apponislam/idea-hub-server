"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogRoutes = void 0;
const express_1 = __importDefault(require("express"));
const blog_controller_1 = require("./blog.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const router = express_1.default.Router();
router.post("/", (0, auth_1.default)(), blog_controller_1.blogController.createBlog);
router.get("/public/:blogId", blog_controller_1.blogController.getSingleBlogPublic);
router.get("/my-blogs", (0, auth_1.default)(), blog_controller_1.blogController.getMyBlogs);
router.get("/my-blogs/:id", (0, auth_1.default)(), blog_controller_1.blogController.getSingleBlog);
router.get("/", blog_controller_1.blogController.getAllBlogs);
router.patch("/:id", (0, auth_1.default)(), blog_controller_1.blogController.updateBlog);
router.delete("/:id", (0, auth_1.default)(), blog_controller_1.blogController.deleteBlog);
// Admin routes
router.get("/admin/blogs", (0, auth_1.default)(), blog_controller_1.blogController.getBlogsForAdmin);
router.get("/admin/blogs/:id", (0, auth_1.default)(), blog_controller_1.blogController.getSingleBlogForAdmin);
exports.blogRoutes = router;
