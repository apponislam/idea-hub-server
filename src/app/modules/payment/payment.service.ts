import { IdeaStatus, PaymentStatus } from "../../../generated/prisma";
import prisma from "../../../prisma/client";
import AppError from "../../error/AppError";
import { paymentUtils } from "./payment.utils";

const createPayment = async (userId: string, ideaId: string, client_ip: string) => {
    // console.log(userId, ideaId, ip);
    const mainIdea = await prisma.idea.findUnique({
        where: {
            id: ideaId,
            isPaid: true,
            status: IdeaStatus.APPROVED,
            isDeleted: false,
        },
    });

    if (!mainIdea) {
        throw new AppError(404, "Idea Not Found");
    }

    const userData = await prisma.user.findUnique({
        where: {
            id: userId,
        },
    });

    if (!userData) {
        throw new AppError(404, "User Not Found");
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

    const payment = await paymentUtils.makePaymentAsync(shurjopayPayload);

    const mainPayment = await prisma.payment.create({
        data: {
            ideaId,
            userId,
            amount: mainIdea.price!,
            transactionId: payment.sp_order_id,
        },
    });

    return payment.checkout_url;
};

const verifyPayment = async (order_id: string) => {
    const verifiedPayment = await paymentUtils.verifyPaymentAsync(order_id);

    if (verifiedPayment.length) {
        const payment = verifiedPayment[0];

        let paymentStatus: PaymentStatus;
        if (payment.bank_status === "Success") {
            paymentStatus = PaymentStatus.PAID;
        } else if (payment.bank_status === "Failed") {
            paymentStatus = PaymentStatus.FAILED;
        } else if (payment.bank_status === "Cancel") {
            paymentStatus = PaymentStatus.CANCELLED;
        } else {
            paymentStatus = PaymentStatus.PENDING;
        }

        const updatedOrder = await prisma.payment.update({
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
};

const getAllPaymentsForAdmin = async () => {
    const payments = await prisma.payment.findMany({
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
};

const getRealPurchases = async (userId: string, ideaId: string) => {
    if (!ideaId) {
        throw new AppError(400, "Idea ID is required");
    }

    const purchases = await prisma.payment.findMany({
        where: {
            userId,
            ideaId,
            paymentStatus: PaymentStatus.PAID,
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
};

const getMyPurchasedIdeas = async (userId: string) => {
    const payments = await prisma.payment.findMany({
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
    return payments.map((payment) => ({
        ...payment.idea,
        purchasedAt: payment.createdAt,
        transactionId: payment.transactionId,
        paymentAmount: payment.amount,
    }));
};

export const paymentService = {
    createPayment,
    verifyPayment,
    getAllPaymentsForAdmin,
    getRealPurchases,
    getMyPurchasedIdeas,
};
