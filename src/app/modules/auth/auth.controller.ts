import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { authServices } from "./auth.service";
import AppError from "../../error/AppError";

const loginUser = catchAsync(async (req: Request, res: Response) => {
    const result = await authServices.loginUser(req.body);

    const { refreshToken } = result;

    res.cookie("refreshToken", refreshToken, {
        secure: false,
        httpOnly: true,
    });

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Logged in successfully!",
        data: {
            user: result.user,
            accessToken: result.accessToken,
        },
    });
});

const getMe = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    if (!req.user) {
        throw new AppError(401, "Unauthorized");
    }
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "User fetched successfully",
        data: req.user,
    });
});

export const authController = {
    loginUser,
    getMe,
};
