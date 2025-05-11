"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentService = void 0;
const client_1 = __importDefault(require("../../../prisma/client"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const createComment = (ideaId, userId, content, parentCommentId) => __awaiter(void 0, void 0, void 0, function* () {
    const idea = yield client_1.default.idea.findFirst({
        where: {
            id: ideaId,
            isDeleted: false,
        },
    });
    if (!idea) {
        throw new AppError_1.default(404, "Idea not found");
    }
    if (parentCommentId) {
        const parentComment = yield client_1.default.comment.findFirst({
            where: {
                id: parentCommentId,
                isDeleted: false,
            },
        });
        if (!parentComment) {
            throw new AppError_1.default(404, "Parent comment not found");
        }
    }
    return yield client_1.default.comment.create({
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
});
const getCommentsByIdea = (ideaId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield client_1.default.comment.findMany({
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
});
const updateComment = (commentId, userId, userRole, content) => __awaiter(void 0, void 0, void 0, function* () {
    const comment = yield client_1.default.comment.findFirst({
        where: {
            id: commentId,
            isDeleted: false,
        },
    });
    if (!comment) {
        throw new AppError_1.default(404, "Comment not found");
    }
    // Authorization check
    if (comment.userId !== userId && userRole !== "ADMIN") {
        throw new AppError_1.default(403, "You can only edit your own comments");
    }
    return yield client_1.default.comment.update({
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
});
const deleteComment = (commentId, userId, userRole) => __awaiter(void 0, void 0, void 0, function* () {
    const comment = yield client_1.default.comment.findFirst({
        where: {
            id: commentId,
            isDeleted: false,
        },
    });
    if (!comment) {
        throw new AppError_1.default(404, "Comment not found");
    }
    // Authorization check
    if (comment.userId !== userId && userRole !== "ADMIN") {
        throw new AppError_1.default(403, "You can only delete your own comments");
    }
    return yield client_1.default.comment.update({
        where: { id: commentId },
        data: {
            isDeleted: true,
        },
    });
});
exports.commentService = {
    createComment,
    getCommentsByIdea,
    updateComment,
    deleteComment,
};
