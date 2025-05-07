import { VoteType } from "../../../generated/prisma";
import prisma from "../../../prisma/client";
import AppError from "../../error/AppError";

const voteIdea = async (ideaId: string, userId: string, voteType: VoteType) => {
    const idea = await prisma.idea.findFirst({
        where: {
            id: ideaId,
            isDeleted: false,
        },
    });

    if (!idea) {
        throw new AppError(404, "Idea not found");
    }

    const existingVote = await prisma.vote.findUnique({
        where: {
            userId_ideaId: {
                userId,
                ideaId,
            },
        },
    });

    if (existingVote && existingVote.type === voteType) {
        await prisma.vote.delete({
            where: {
                id: existingVote.id,
            },
        });
        return { action: "removed", voteType: null };
    }

    if (existingVote) {
        const updatedVote = await prisma.vote.update({
            where: {
                id: existingVote.id,
            },
            data: {
                type: voteType,
            },
        });
        return { action: "updated", voteType };
    }

    const newVote = await prisma.vote.create({
        data: {
            userId,
            ideaId,
            type: voteType,
        },
    });

    return { action: "created", voteType };
};

const getUserVote = async (ideaId: string, userId: string) => {
    return await prisma.vote.findUnique({
        where: {
            userId_ideaId: {
                userId,
                ideaId,
            },
        },
    });
};

export const voteService = {
    voteIdea,
    getUserVote,
};
