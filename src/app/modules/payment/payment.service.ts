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

export const paymentService = {
    createPayment,
    verifyPayment,
};
