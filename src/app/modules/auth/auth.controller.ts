import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { authServices } from "./auth.service";
import AppError from "../../error/AppError";

const loginUser = catchAsync(async (req: Request, res: Response) => {
    const result = await authServices.loginUser(req.body);

    const { refreshToken, accessToken } = result;

    res.cookie("refreshToken", refreshToken, {
        secure: false,
        sameSite: "lax",
        httpOnly: true,
    });

    res.cookie("next-auth.session-token", accessToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
    });

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Logged in successfully!",
        data: {
            user: result.user,
            accessToken: result.accessToken,
            refreshToken,
        },
    });
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
    const { refreshToken } = req.cookies;

    const result = await authServices.refreshToken(refreshToken);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Access token genereated successfully!",
        data: result,
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
    refreshToken,
};
