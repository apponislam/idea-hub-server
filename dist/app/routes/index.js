"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_route_1 = require("../modules/user/user.route");
const idea_route_1 = require("../modules/idea/idea.route");
const auth_route_1 = require("../modules/auth/auth.route");
const vote_route_1 = require("../modules/vote/vote.route");
const commnet_route_1 = require("../modules/comment/commnet.route");
const payment_route_1 = require("../modules/payment/payment.route");
const category_route_1 = require("../modules/category/category.route");
const blog_route_1 = require("../modules/blogs/blog.route");
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: "/user",
        route: user_route_1.userRoute,
    },
    {
        path: "/auth",
        route: auth_route_1.authRoute,
    },
    {
        path: "/idea",
        route: idea_route_1.ideaRoutes,
    },
    {
        path: "/category",
        route: category_route_1.categoryRoutes,
    },
    {
        path: "/vote",
        route: vote_route_1.voteRoutes,
    },
    {
        path: "/comment",
        route: commnet_route_1.commentRoutes,
    },
    {
        path: "/payment",
        route: payment_route_1.paymentRoutes,
    },
    {
        path: "/blog",
        route: blog_route_1.blogRoutes,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
