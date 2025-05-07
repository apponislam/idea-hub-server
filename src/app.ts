import express, { Application, Request, Response } from "express";
import cors from "cors";
import notFoundHandler from "./app/middlewares/notFoundRoute";
import globalErrorHandler from "./app/middlewares/globalErrorHandaler";
import router from "./app/routes";

const app: Application = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
    res.send({
        Message: "Idea Hub",
    });
});

app.use("/api/v1", router);

app.use(notFoundHandler);
app.use(globalErrorHandler);

export default app;
