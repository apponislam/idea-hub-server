import express from "express";
import { userRoute } from "../modules/user/user.route";
import { ideaRoutes } from "../modules/idea/idea.route";
import { authRoute } from "../modules/auth/auth.route";
import { voteRoutes } from "../modules/vote/vote.route";

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
        path: "/vote",
        route: voteRoutes,
    },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
