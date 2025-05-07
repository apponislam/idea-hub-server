import express from "express";
import { paymentController } from "./payment.controller";
import auth from "../../middlewares/auth";

const router = express.Router();

router.post("/", auth(), paymentController.createOrder);
router.patch("/verify", auth(), paymentController.verifyPayment);
// router.get("/my-payments", auth(), paymentController.getUserPayments);

export const paymentRoutes = router;
