import { Request, Response } from "express";
import { ideaService } from "./idea.service";
import sendResponse from "../../utils/sendResponse";
import catchAsync from "../../utils/catchAsync";
import AppError from "../../error/AppError";

const createIdea = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) {
        throw new AppError(404, "User not found");
    }

    const idea = await ideaService.createIdea({
        ...req.body,
        creatorId: req.user.id,
        categoryIds: req.body.categoryIds,
    });

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Idea created successfully",
        data: idea,
    });
});

export const ideaController = {
    createIdea,
};
