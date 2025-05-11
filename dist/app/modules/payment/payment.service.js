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
exports.paymentService = void 0;
const prisma_1 = require("../../../../generated/prisma");
const client_1 = __importDefault(require("../../../prisma/client"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const payment_utils_1 = require("./payment.utils");
const createPayment = (userId, ideaId, client_ip) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(userId, ideaId, ip);
    const mainIdea = yield client_1.default.idea.findUnique({
        where: {
            id: ideaId,
            isPaid: true,
            status: prisma_1.IdeaStatus.APPROVED,
            isDeleted: false,
        },
    });
    if (!mainIdea) {
        throw new AppError_1.default(404, "Idea Not Found");
    }
    const userData = yield client_1.default.user.findUnique({
        where: {
            id: userId,
        },
    });
    if (!userData) {
        throw new AppError_1.default(404, "User Not Found");
    }
    console.log("new", mainIdea);
    const shurjopayPayload = {
        amount: mainIdea.price,
        order_id: mainIdea.id,
        currency: "BDT",
        customer_name: userData.name,
        customer_address: "N/A",
        customer_email: userData.email,
        customer_phone: "N/A",
        customer_city: "N/A",
        client_ip,
    };
    const payment = yield payment_utils_1.paymentUtils.makePaymentAsync(shurjopayPayload);
    const mainPayment = yield client_1.default.payment.create({
        data: {
            ideaId,
            userId,
            amount: mainIdea.price,
            transactionId: payment.sp_order_id,
        },
    });
    return payment.checkout_url;
});
const verifyPayment = (order_id) => __awaiter(void 0, void 0, void 0, function* () {
    const verifiedPayment = yield payment_utils_1.paymentUtils.verifyPaymentAsync(order_id);
    if (verifiedPayment.length) {
        const payment = verifiedPayment[0];
        let paymentStatus;
        if (payment.bank_status === "Success") {
            paymentStatus = prisma_1.PaymentStatus.PAID;
        }
        else if (payment.bank_status === "Failed") {
            paymentStatus = prisma_1.PaymentStatus.FAILED;
        }
        else if (payment.bank_status === "Cancel") {
            paymentStatus = prisma_1.PaymentStatus.CANCELLED;
        }
        else {
            paymentStatus = prisma_1.PaymentStatus.PENDING;
        }
        const updatedOrder = yield client_1.default.payment.update({
            where: {
                transactionId: order_id,
            },
            data: {
                paymentStatus: paymentStatus,
            },
            include: {
                user: true,
                idea: true,
            },
        });
        return updatedOrder;
    }
    return null;
});
const getAllPaymentsForAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    const payments = yield client_1.default.payment.findMany({
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
            idea: {
                select: {
                    id: true,
                    title: true,
                    price: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });
    return payments;
});
const getRealPurchases = (userId, ideaId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!ideaId) {
        throw new AppError_1.default(400, "Idea ID is required");
    }
    const purchases = yield client_1.default.payment.findMany({
        where: {
            userId,
            ideaId,
            paymentStatus: prisma_1.PaymentStatus.PAID,
        },
        include: {
            idea: {
                select: {
                    id: true,
                    title: true,
                    description: true,
                    price: true,
                    createdAt: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });
    return purchases;
});
const getMyPurchasedIdeas = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const payments = yield client_1.default.payment.findMany({
        where: {
            userId: userId,
            paymentStatus: "PAID",
        },
        include: {
            idea: {
                select: {
                    id: true,
                    title: true,
                    description: true,
                    price: true,
                    images: true,
                    creator: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            image: true,
                        },
                    },
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });
    // Transform the data to focus on ideas
    return payments.map((payment) => (Object.assign(Object.assign({}, payment.idea), { purchasedAt: payment.createdAt, transactionId: payment.transactionId, paymentAmount: payment.amount })));
});
exports.paymentService = {
    createPayment,
    verifyPayment,
    getAllPaymentsForAdmin,
    getRealPurchases,
    getMyPurchasedIdeas,
};
