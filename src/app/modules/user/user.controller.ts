import { Request, Response } from "express";
import { userService } from "./user.service";
import sendResponse from "../../utils/sendResponse";
import catchAsync from "../../utils/catchAsync";

const createUser = catchAsync(async (req: Request, res: Response) => {
    const user = await userService.createUser(req.body);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "User registered successfully",
        data: user,
    });
});

export const userController = {
    createUser,
};
