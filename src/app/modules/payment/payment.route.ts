import express from "express";
import { paymentController } from "./payment.controller";
import auth from "../../middlewares/auth";

const router = express.Router();

router.post("/", auth(), paymentController.createOrder);
router.get("/verify", paymentController.verifyPayment);

router.get("/paymentsAdmin", auth(), paymentController.getAllPaymentsForAdmin);

router.get("/my-purchases", auth(), paymentController.getMyPurchasedIdeas);
router.get("/my-purchases/:ideaId", auth(), paymentController.getRealPurchases);

export const paymentRoutes = router;
