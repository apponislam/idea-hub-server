import express from "express";
import { userRoute } from "../modules/user/user.route";
import { ideaRoutes } from "../modules/idea/idea.route";
import { authRoute } from "../modules/auth/auth.route";
import { voteRoutes } from "../modules/vote/vote.route";
import { commentRoutes } from "../modules/comment/commnet.route";
import { paymentRoutes } from "../modules/payment/payment.route";
import { categoryRoutes } from "../modules/category/category.route";
import { blogRoutes } from "../modules/blogs/blog.route";

const router = express.Router();

const moduleRoutes = [
    {
        path: "/user",
        route: userRoute,
    },
    {
        path: "/auth",
        route: authRoute,
    },
    {
        path: "/idea",
        route: ideaRoutes,
    },
    {
        path: "/category",
        route: categoryRoutes,
    },
    {
        path: "/vote",
        route: voteRoutes,
    },
    {
        path: "/comment",
        route: commentRoutes,
    },
    {
        path: "/payment",
        route: paymentRoutes,
    },
    {
        path: "/blog",
        route: blogRoutes,
    },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
