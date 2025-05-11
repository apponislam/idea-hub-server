import { Request, Response } from "express";
import AppError from "../../error/AppError";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { paymentService } from "./payment.service";

const createOrder = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) {
        throw new AppError(401, "You are unauthorized");
    }

    const userid = req.user.id;

    console.log(userid);
    console.log(req.body.id);

    const order = await paymentService.createPayment(userid, req.body.id, req.ip!);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Order placed successfully",
        data: order,
    });
});

const verifyPayment = catchAsync(async (req, res) => {
    console.log("hii");

    const order = await paymentService.verifyPayment(req.query.order_id as string);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Order verified successfully",
        data: order,
    });
});

const getAllPaymentsForAdmin = catchAsync(async (req: Request, res: Response) => {
    if (req.user?.role !== "ADMIN") {
        throw new AppError(403, "Forbidden: Admin access required");
    }

    const payments = await paymentService.getAllPaymentsForAdmin();

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Payments retrieved successfully",
        data: payments,
    });
});

const getRealPurchases = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) {
        throw new AppError(401, "You are unauthorized");
    }

    if (!req.params.ideaId) {
        throw new AppError(400, "Idea ID is required");
    }

    const purchases = await paymentService.getRealPurchases(req.user.id, req.params.ideaId);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Purchases retrieved successfully",
        data: purchases,
    });
});

export const paymentController = {
    createOrder,
    verifyPayment,
    getAllPaymentsForAdmin,
    getRealPurchases,
};
