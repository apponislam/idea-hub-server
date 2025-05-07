import { Request, Response } from "express";
import { commentService } from "./comment.service";
import catchAsync from "../../utils/catchAsync";
import AppError from "../../error/AppError";
import sendResponse from "../../utils/sendResponse";

const createComment = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) {
        throw new AppError(401, "Unauthorized");
    }

    const { ideaId } = req.params;
    const { content, parentCommentId } = req.body;

    const comment = await commentService.createComment(ideaId, req.user.id, content, parentCommentId);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Comment created successfully",
        data: comment,
    });
});

const getComments = catchAsync(async (req: Request, res: Response) => {
    const { ideaId } = req.params;
    const comments = await commentService.getCommentsByIdea(ideaId);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Comments retrieved successfully",
        data: comments,
    });
});

const updateComment = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) {
        throw new AppError(401, "Unauthorized");
    }

    const { commentId } = req.params;
    const { content } = req.body;

    const comment = await commentService.updateComment(commentId, req.user.id, req.user.role, content);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Comment updated successfully",
        data: comment,
    });
});

const deleteComment = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) {
        throw new AppError(401, "Unauthorized");
    }

    const { commentId } = req.params;

    const result = await commentService.deleteComment(commentId, req.user.id, req.user.role);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Comment deleted successfully",
        data: result,
    });
});

export const commentController = {
    createComment,
    getComments,
    updateComment,
    deleteComment,
};
