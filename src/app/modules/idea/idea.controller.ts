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

const getAllIdeas = catchAsync(async (req: Request, res: Response) => {
    const filters = {
        searchTerm: req.query.search as string,
        category: req.query.category as string,
        status: req.query.status as string,
        isPaid: req.query.isPaid ? req.query.isPaid === "true" : undefined,
    };

    const ideas = await ideaService.getAllIdeas(filters);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Ideas retrieved successfully",
        data: ideas,
    });
});

const updateIdea = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) {
        throw new AppError(401, "Unauthorized");
    }

    const idea = await ideaService.updateIdea(
        req.params.id, // ideaId from route
        req.body, // update data
        req.user.id, // current user ID
        req.user.role // current user role
    );

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Idea updated successfully",
        data: idea,
    });
});

const deleteIdea = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) {
        throw new AppError(401, "Unauthorized");
    }

    const result = await ideaService.deleteIdea(
        req.params.id, // ideaId from route
        req.user.id, // current user ID
        req.user.role // current user role
    );

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Idea deleted successfully",
        data: result,
    });
});

export const ideaController = {
    createIdea,
    getAllIdeas,
    updateIdea,
    deleteIdea,
};
