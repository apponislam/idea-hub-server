import prisma from "../../../prisma/client";
import AppError from "../../error/AppError";

const createComment = async (ideaId: string, userId: string, content: string, parentCommentId?: string) => {
    const idea = await prisma.idea.findFirst({
        where: {
            id: ideaId,
            isDeleted: false,
        },
    });

    if (!idea) {
        throw new AppError(404, "Idea not found");
    }

    if (parentCommentId) {
        const parentComment = await prisma.comment.findFirst({
            where: {
                id: parentCommentId,
                isDeleted: false,
            },
        });

        if (!parentComment) {
            throw new AppError(404, "Parent comment not found");
        }
    }

    return await prisma.comment.create({
        data: {
            content,
            userId,
            ideaId,
            parentCommentId,
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                },
            },
            replies: {
                where: { isDeleted: false },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            image: true,
                        },
                    },
                },
            },
        },
    });
};

const getCommentsByIdea = async (ideaId: string) => {
    return await prisma.comment.findMany({
        where: {
            ideaId,
            isDeleted: false,
            parentCommentId: null,
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                },
            },
            replies: {
                where: { isDeleted: false },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            image: true,
                        },
                    },
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });
};

const updateComment = async (commentId: string, userId: string, userRole: string, content: string) => {
    const comment = await prisma.comment.findFirst({
        where: {
            id: commentId,
            isDeleted: false,
        },
    });

    if (!comment) {
        throw new AppError(404, "Comment not found");
    }

    // Authorization check
    if (comment.userId !== userId && userRole !== "ADMIN") {
        throw new AppError(403, "You can only edit your own comments");
    }

    return await prisma.comment.update({
        where: { id: commentId },
        data: { content },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                },
            },
        },
    });
};

const deleteComment = async (commentId: string, userId: string, userRole: string) => {
    const comment = await prisma.comment.findFirst({
        where: {
            id: commentId,
            isDeleted: false,
        },
    });

    if (!comment) {
        throw new AppError(404, "Comment not found");
    }

    // Authorization check
    if (comment.userId !== userId && userRole !== "ADMIN") {
        throw new AppError(403, "You can only delete your own comments");
    }

    return await prisma.comment.update({
        where: { id: commentId },
        data: {
            isDeleted: true,
        },
    });
};

export const commentService = {
    createComment,
    getCommentsByIdea,
    updateComment,
    deleteComment,
};
