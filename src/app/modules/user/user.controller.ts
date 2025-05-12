import { Request, Response } from "express";
import { userService } from "./user.service";
import sendResponse from "../../utils/sendResponse";
import catchAsync from "../../utils/catchAsync";
import { Role } from "../../../../generated/prisma";
import AppError from "../../error/AppError";

const createUser = catchAsync(async (req: Request, res: Response) => {
    const user = await userService.createUser(req.body);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "User registered successfully",
        data: user,
    });
});

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
    const users = await userService.getAllUsers();
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Users retrieved successfully",
        data: users,
    });
});

const updateUserRole = catchAsync(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const { role } = req.body;

    if (!Role) {
        throw new AppError(400, "Invalid role provided");
    }

    const user = await userService.updateUserRole(userId, role);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "User role updated successfully",
        data: user,
    });
});

const activateUser = catchAsync(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const user = await userService.activateUser(userId);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "User activated successfully",
        data: user,
    });
});

const deactivateUser = catchAsync(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const user = await userService.deactivateUser(userId);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "User deactivated successfully",
        data: user,
    });
});

const deleteUser = catchAsync(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const user = await userService.deleteUser(userId);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "User delected successfully",
        data: user,
    });
});

export const userController = {
    createUser,
    getAllUsers,
    updateUserRole,
    activateUser,
    deactivateUser,
    deleteUser,
};
