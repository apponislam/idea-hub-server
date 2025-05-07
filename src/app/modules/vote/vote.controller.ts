import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import AppError from "../../error/AppError";
import { voteService } from "./vote.service";
import sendResponse from "../../utils/sendResponse";

const vote = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) {
        throw new AppError(401, "Unauthorized");
    }

    const { ideaId } = req.params;
    const { type } = req.body;

    if (!["UPVOTE", "DOWNVOTE"].includes(type)) {
        throw new AppError(400, "Invalid vote type");
    }

    const result = await voteService.voteIdea(ideaId, req.user.id, type);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: `Vote ${result.action} successfully`,
        data: {
            action: result.action,
            voteType: result.voteType,
        },
    });
});

const getVote = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) {
        throw new AppError(401, "Unauthorized");
    }

    const { ideaId } = req.params;

    const vote = await voteService.getUserVote(ideaId, req.user.id);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Vote retrieved successfully",
        data: vote,
    });
});

export const voteController = {
    vote,
    getVote,
};
