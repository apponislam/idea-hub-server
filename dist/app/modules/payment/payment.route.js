"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentRoutes = void 0;
const express_1 = __importDefault(require("express"));
const payment_controller_1 = require("./payment.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const router = express_1.default.Router();
router.post("/", (0, auth_1.default)(), payment_controller_1.paymentController.createOrder);
router.get("/verify", payment_controller_1.paymentController.verifyPayment);
router.get("/paymentsAdmin", (0, auth_1.default)(), payment_controller_1.paymentController.getAllPaymentsForAdmin);
router.get("/my-purchases", (0, auth_1.default)(), payment_controller_1.paymentController.getMyPurchasedIdeas);
router.get("/my-purchases/:ideaId", (0, auth_1.default)(), payment_controller_1.paymentController.getRealPurchases);
exports.paymentRoutes = router;
