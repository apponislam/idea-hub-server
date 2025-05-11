"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentController = void 0;
const AppError_1 = __importDefault(require("../../error/AppError"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const payment_service_1 = require("./payment.service");
const createOrder = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        throw new AppError_1.default(401, "You are unauthorized");
    }
    const userid = req.user.id;
    console.log(userid);
    console.log(req.body.id);
    const order = yield payment_service_1.paymentService.createPayment(userid, req.body.id, req.ip);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Order placed successfully",
        data: order,
    });
}));
const verifyPayment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("hii");
    const order = yield payment_service_1.paymentService.verifyPayment(req.query.order_id);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Order verified successfully",
        data: order,
    });
}));
const getAllPaymentsForAdmin = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== "ADMIN") {
        throw new AppError_1.default(403, "Forbidden: Admin access required");
    }
    const payments = yield payment_service_1.paymentService.getAllPaymentsForAdmin();
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Payments retrieved successfully",
        data: payments,
    });
}));
const getRealPurchases = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        throw new AppError_1.default(401, "You are unauthorized");
    }
    if (!req.params.ideaId) {
        throw new AppError_1.default(400, "Idea ID is required");
    }
    const purchases = yield payment_service_1.paymentService.getRealPurchases(req.user.id, req.params.ideaId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Purchases retrieved successfully",
        data: purchases,
    });
}));
const getMyPurchasedIdeas = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!userId) {
        throw new AppError_1.default(401, "Authentication required");
    }
    const purchasedIdeas = yield payment_service_1.paymentService.getMyPurchasedIdeas(userId);
    // console.log(purchasedIdeas);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Purchased ideas retrieved successfully",
        data: purchasedIdeas,
    });
}));
exports.paymentController = {
    createOrder,
    verifyPayment,
    getAllPaymentsForAdmin,
    getRealPurchases,
    getMyPurchasedIdeas,
};
