import express from "express";
import { userRoute } from "../modules/user/user.route";
import { ideaRoutes } from "../modules/idea/idea.route";

const router = express.Router();

const moduleRoutes = [
    {
        path: "/user",
        route: userRoute,
    },
    {
        path: "/idea",
        route: ideaRoutes,
    },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
