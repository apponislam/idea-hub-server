"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const notFoundRoute_1 = __importDefault(require("./app/middlewares/notFoundRoute"));
const globalErrorHandaler_1 = __importDefault(require("./app/middlewares/globalErrorHandaler"));
const routes_1 = __importDefault(require("./app/routes"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: ["http://localhost:3000", "https://idea-hub-client.vercel.app"],
    credentials: true,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.get("/", (req, res) => {
    res.send({
        Message: "Idea Hub",
    });
});
app.use("/api/v1", routes_1.default);
app.use(notFoundRoute_1.default);
app.use(globalErrorHandaler_1.default);
exports.default = app;
