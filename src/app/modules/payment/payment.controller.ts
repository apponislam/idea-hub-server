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

    const order = await paymentService.createPayment(userid, req.body.id, req.ip!);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Order placed successfully",
        data: order,
    });
});

const verifyPayment = catchAsync(async (req, res) => {
    const order = await paymentService.verifyPayment(req.query.order_id as string);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Order verified successfully",
        data: order,
    });
});

export const paymentController = {
    createOrder,
    verifyPayment,
};
