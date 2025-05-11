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

const getMyIdeas = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) {
        throw new AppError(401, "Unauthorized");
    }

    const filters = {
        searchTerm: req.query.search as string,
        status: req.query.status as string,
        isPaid: req.query.isPaid ? req.query.isPaid === "true" : undefined,
        page: Number(req.query.page) || 1,
        limit: Number(req.query.limit) || 10,
    };

    const result = await ideaService.getMyIdeas(req.user.id, filters);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Your ideas retrieved successfully",
        data: result.data,
        meta: result.meta,
    });
});

const getSingleIdea = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) {
        throw new AppError(401, "Unauthorized");
    }

    const idea = await ideaService.getSingleIdea(req.params.id, req.user.id);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Idea retrieved successfully",
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

const getSingleIdeaPublic = catchAsync(async (req: Request, res: Response) => {
    const { ideaid } = req.params;

    console.log(ideaid);

    const idea = await ideaService.getSingleIdeaPublic(ideaid);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Idea retrieved successfully",
        data: idea,
    });
});

const updateIdea = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) {
        throw new AppError(401, "Unauthorized");
    }

    // console.log(req.body);

    const idea = await ideaService.updateIdea(req.params.id, req.body, req.user.id, req.user.role);

    console.log(idea);

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

    const result = await ideaService.deleteIdea(req.params.id, req.user.id, req.user.role);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Idea deleted successfully",
        data: result,
    });
});

// admin actions

const getIdeasForAdmin = catchAsync(async (req: Request, res: Response) => {
    const filters = {
        searchTerm: req.query.search as string,
        category: req.query.category as string,
        status: req.query.status as string,
        isPaid: req.query.isPaid ? req.query.isPaid === "true" : undefined,
    };

    const pagination = {
        page: Number(req.query.page) || 1,
        limit: Number(req.query.limit) || 10,
    };

    const result = await ideaService.getIdeasForAdmin(filters, pagination);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Ideas retrieved successfully",
        data: result.data,
        meta: result.meta,
    });
});

const getSingleIdeaForAdmin = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!req.user || req.user.role !== "ADMIN") {
        throw new AppError(403, "You are not authorized to view this idea");
    }

    const idea = await ideaService.getSingleIdeaForAdmin(id);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Idea retrieved successfully",
        data: idea,
    });
});

const updateIdeaStatus = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status, rejectionFeedback } = req.body; // Add rejectionFeedback
    const user = req.user;

    if (!req.user) {
        throw new AppError(401, "Unauthorized");
    }

    if (user?.role !== "ADMIN") {
        throw new AppError(403, "You are not authorized to update idea status");
    }

    // Require rejectionFeedback when status is REJECTED
    if (status === "REJECTED" && !rejectionFeedback) {
        throw new AppError(400, "Rejection feedback is required");
    }

    const result = await ideaService.updateIdeaStatus(
        id,
        status,
        status === "REJECTED" ? rejectionFeedback : undefined // Pass feedback if rejected
    );

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Idea status updated successfully",
        data: result,
    });
});

export const ideaController = {
    createIdea,
    getMyIdeas,
    getSingleIdea,
    getAllIdeas,
    getSingleIdeaPublic,
    updateIdea,
    deleteIdea,
    getIdeasForAdmin,
    getSingleIdeaForAdmin,
    updateIdeaStatus,
};
