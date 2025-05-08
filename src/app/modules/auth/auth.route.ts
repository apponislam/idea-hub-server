import express from "express";
import { authController } from "./auth.controller";
import auth from "../../middlewares/auth";

const router = express.Router();

router.post("/login", authController.loginUser);
router.get("/me", auth(), authController.getMe);

export const authRoute = router;
