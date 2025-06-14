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
exports.ideaService = void 0;
const client_1 = __importDefault(require("../../../prisma/client"));
const prisma_1 = require("../../../../generated/prisma");
const AppError_1 = __importDefault(require("../../error/AppError"));
const createIdea = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const isActuallyPaid = data.isPaid && data.price !== null && data.price !== 0;
    const actualPrice = isActuallyPaid ? data.price : null;
    const categories = yield client_1.default.category.findMany({
        where: {
            id: { in: data.categoryIds },
        },
    });
    if (categories.length !== data.categoryIds.length) {
        const missingIds = data.categoryIds.filter((id) => !categories.some((c) => c.id === id));
        throw new AppError_1.default(400, `Categories not found: ${missingIds.join(", ")}`);
    }
    const idea = yield client_1.default.idea.create({
        data: {
            title: data.title,
            problemStatement: data.problemStatement,
            proposedSolution: data.proposedSolution,
            description: data.description,
            images: data.images || [],
            isPaid: isActuallyPaid,
            price: actualPrice,
            status: data.status,
            creatorId: data.creatorId,
            categories: {
                createMany: {
                    data: data.categoryIds.map((categoryId) => ({ categoryId })),
                },
            },
        },
        include: {
            categories: {
                include: {
                    category: true,
                },
            },
            creator: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
        },
    });
    return idea;
});
const getMyIdeas = (creatorId, filters) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm, status, isPaid, page = 1, limit = 10 } = filters;
    const skip = (page - 1) * limit;
    const where = Object.assign(Object.assign(Object.assign({ creatorId, isDeleted: false }, (searchTerm && {
        OR: [{ title: { contains: searchTerm, mode: "insensitive" } }, { description: { contains: searchTerm, mode: "insensitive" } }, { problemStatement: { contains: searchTerm, mode: "insensitive" } }, { proposedSolution: { contains: searchTerm, mode: "insensitive" } }],
    })), (status && { status: status })), (typeof isPaid === "boolean" && { isPaid }));
    const [ideas, total] = yield Promise.all([
        client_1.default.idea.findMany({
            where,
            include: {
                categories: {
                    include: {
                        category: true,
                    },
                },
                creator: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                _count: {
                    select: {
                        votes: true,
                        comments: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
            skip,
            take: limit,
        }),
        client_1.default.idea.count({ where }),
    ]);
    return {
        data: ideas,
        meta: {
            page,
            limit,
            total,
        },
    };
});
const getSingleIdea = (ideaId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const idea = yield client_1.default.idea.findFirst({
        where: {
            id: ideaId,
            creatorId: userId,
            isDeleted: false,
        },
        include: {
            categories: {
                include: {
                    category: true,
                },
            },
            creator: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
            _count: {
                select: {
                    votes: true,
                    comments: true,
                },
            },
        },
    });
    if (!idea) {
        throw new AppError_1.default(404, "Idea not found");
    }
    return idea;
});
const getAllIdeas = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm, category, status, isPaid } = filters;
    const page = Number(paginationOptions.page) || 1;
    const limit = Number(paginationOptions.limit) || 10;
    const skip = (page - 1) * limit;
    const where = {
        status: "APPROVED",
        isDeleted: false,
    };
    if (searchTerm) {
        where.OR = [{ title: { contains: searchTerm, mode: "insensitive" } }, { problemStatement: { contains: searchTerm, mode: "insensitive" } }, { description: { contains: searchTerm, mode: "insensitive" } }];
    }
    if (category) {
        where.categories = {
            some: {
                category: {
                    name: {
                        equals: category,
                        mode: "insensitive",
                    },
                },
            },
        };
    }
    if (status) {
        where.status = status;
    }
    if (isPaid !== undefined) {
        where.isPaid = isPaid;
    }
    // Get total count of matching records
    const total = yield client_1.default.idea.count({ where });
    const ideas = yield client_1.default.idea.findMany({
        where,
        include: {
            categories: {
                include: {
                    category: true,
                },
            },
            creator: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
            _count: {
                select: {
                    votes: true,
                    comments: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
        skip,
        take: limit,
    });
    return {
        data: ideas,
        meta: {
            page,
            limit,
            total,
        },
    };
});
const getSingleIdeaPublic = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const idea = yield client_1.default.idea.findUnique({
        where: {
            id,
            isDeleted: false,
            status: "APPROVED",
        },
        include: {
            creator: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                },
            },
            categories: {
                include: {
                    category: true,
                },
            },
            votes: {
                select: {
                    id: true,
                    type: true,
                    userId: true,
                },
            },
            comments: {
                where: {
                    isDeleted: false,
                    parentCommentId: null, // Only get top-level comments initially
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            image: true,
                        },
                    },
                    replies: {
                        where: {
                            isDeleted: false,
                        },
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    name: true,
                                    image: true,
                                },
                            },
                            replies: {
                                // Include nested replies recursively
                                where: {
                                    isDeleted: false,
                                },
                                include: {
                                    user: {
                                        select: {
                                            id: true,
                                            name: true,
                                            image: true,
                                        },
                                    },
                                },
                                orderBy: {
                                    createdAt: "asc",
                                },
                            },
                        },
                        orderBy: {
                            createdAt: "asc",
                        },
                    },
                },
                orderBy: {
                    createdAt: "desc",
                },
            },
            _count: {
                select: {
                    votes: true,
                    comments: true,
                },
            },
        },
    });
    if (!idea) {
        throw new Error("Idea not found");
    }
    const [filteredCommentCount] = yield Promise.all([
        client_1.default.comment.count({
            where: {
                ideaId: id,
                isDeleted: false,
            },
        }),
    ]);
    const upvotes = idea.votes.filter((vote) => vote.type === "UPVOTE").length;
    const downvotes = idea.votes.filter((vote) => vote.type === "DOWNVOTE").length;
    return Object.assign(Object.assign({}, idea), { upvotes,
        downvotes, commentCount: filteredCommentCount, comments: idea.comments });
});
// const getSingleIdeaPublic = async (id: string) => {
//     const idea = await prisma.idea.findUnique({
//         where: {
//             id,
//             isDeleted: false,
//             status: "APPROVED",
//         },
//         include: {
//             creator: {
//                 select: {
//                     id: true,
//                     name: true,
//                     email: true,
//                     image: true,
//                 },
//             },
//             categories: {
//                 include: {
//                     category: true,
//                 },
//             },
//             votes: {
//                 select: {
//                     id: true,
//                     type: true,
//                     userId: true,
//                 },
//             },
//             comments: {
//                 where: {
//                     isDeleted: false,
//                     parentCommentId: null,
//                 },
//                 include: {
//                     user: {
//                         select: {
//                             id: true,
//                             name: true,
//                             image: true,
//                         },
//                     },
//                     replies: {
//                         where: {
//                             isDeleted: false,
//                         },
//                         include: {
//                             user: {
//                                 select: {
//                                     id: true,
//                                     name: true,
//                                     image: true,
//                                 },
//                             },
//                             replies: {
//                                 where: {
//                                     isDeleted: false,
//                                 },
//                                 include: {
//                                     user: {
//                                         select: {
//                                             id: true,
//                                             name: true,
//                                             image: true,
//                                         },
//                                     },
//                                 },
//                                 orderBy: {
//                                     createdAt: "asc",
//                                 },
//                             },
//                         },
//                         orderBy: {
//                             createdAt: "asc",
//                         },
//                     },
//                 },
//                 orderBy: {
//                     createdAt: "desc",
//                 },
//             },
//         },
//     });
//     if (!idea) {
//         throw new Error("Idea not found");
//     }
//     // Filtered counts
//     const [filteredCommentCount, totalVoteCount] = await Promise.all([
//         prisma.comment.count({
//             where: {
//                 ideaId: id,
//                 isDeleted: false,
//             },
//         }),
//         prisma.vote.count({
//             where: {
//                 ideaId: id,
//             },
//         }),
//     ]);
//     const upvotes = idea.votes.filter((vote) => vote.type === "UPVOTE").length;
//     const downvotes = idea.votes.filter((vote) => vote.type === "DOWNVOTE").length;
//     return {
//         ...idea,
//         upvotes,
//         downvotes,
//         commentCount: filteredCommentCount,
//         voteCount: totalVoteCount,
//         comments: idea.comments,
//     };
// };
const updateIdea = (ideaId, data, userId, userRole) => __awaiter(void 0, void 0, void 0, function* () {
    const existingIdea = yield client_1.default.idea.findFirst({
        where: {
            id: ideaId,
            isDeleted: false,
        },
        include: { creator: true },
    });
    // console.log(existingIdea);
    if (!existingIdea) {
        throw new AppError_1.default(404, "Idea not found");
    }
    const isOwner = existingIdea.creatorId === userId;
    const isAdmin = userRole === "ADMIN";
    if (!isOwner && !isAdmin) {
        throw new AppError_1.default(403, "You can only edit your own ideas");
    }
    let categoryUpdates = {};
    if (data.categoryIds) {
        categoryUpdates = {
            categories: {
                deleteMany: {},
                createMany: {
                    data: data.categoryIds.map((categoryId) => ({ categoryId })),
                },
            },
        };
    }
    const { title, description, problemStatement, proposedSolution, status, images } = data;
    const isActuallyPaid = data.isPaid && data.price !== null && data.price !== 0;
    const actualPrice = isActuallyPaid ? data.price : null;
    return yield client_1.default.idea.update({
        where: { id: ideaId },
        data: Object.assign({ title, description: description === null || description === void 0 ? void 0 : description.trim(), problemStatement,
            proposedSolution,
            status,
            images, isPaid: isActuallyPaid, price: actualPrice }, categoryUpdates),
        include: {
            categories: {
                include: {
                    category: true,
                },
            },
            creator: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
        },
    });
});
const deleteIdea = (ideaId, userId, userRole) => __awaiter(void 0, void 0, void 0, function* () {
    const existingIdea = yield client_1.default.idea.findFirst({
        where: {
            id: ideaId,
            isDeleted: false,
        },
    });
    if (!existingIdea) {
        throw new AppError_1.default(404, "Idea not found");
    }
    if (existingIdea.creatorId !== userId && userRole !== "ADMIN") {
        throw new AppError_1.default(403, "You can only delete your own ideas");
    }
    return yield client_1.default.idea.update({
        where: { id: ideaId },
        data: {
            isDeleted: true,
        },
    });
});
// admin get
const getIdeasForAdmin = (filters, pagination) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;
    const where = {
        isDeleted: false,
    };
    if (filters.searchTerm) {
        where.OR = [{ title: { contains: filters.searchTerm, mode: "insensitive" } }, { description: { contains: filters.searchTerm, mode: "insensitive" } }];
    }
    if (filters.category && filters.category !== "ALL") {
        where.categories = {
            some: {
                category: {
                    name: filters.category,
                },
            },
        };
    }
    if (filters.status && filters.status !== "ALL") {
        where.status = filters.status;
    }
    if (filters.isPaid !== undefined) {
        where.isPaid = filters.isPaid;
    }
    const ideas = yield client_1.default.idea.findMany({
        where,
        include: {
            categories: {
                include: {
                    category: true,
                },
            },
            creator: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
        },
        skip,
        take: limit,
        orderBy: {
            createdAt: "desc",
        },
    });
    const total = yield client_1.default.idea.count({ where });
    return {
        data: ideas,
        meta: {
            page,
            limit,
            total,
        },
    };
});
const getSingleIdeaForAdmin = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const idea = yield client_1.default.idea.findUnique({
        where: {
            id,
            isDeleted: false,
        },
        include: {
            categories: {
                include: {
                    category: true,
                },
            },
            creator: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
            _count: {
                select: {
                    votes: true,
                    comments: true,
                },
            },
        },
    });
    if (!idea) {
        throw new AppError_1.default(404, "Idea not found");
    }
    return idea;
});
const updateIdeaStatus = (id, status, rejectionFeedback // Add optional parameter
) => __awaiter(void 0, void 0, void 0, function* () {
    if (!Object.values(prisma_1.IdeaStatus).includes(status)) {
        throw new AppError_1.default(404, "Invalid status value");
    }
    const updateData = { status };
    if (status === "REJECTED" && rejectionFeedback) {
        updateData.rejectionFeedback = rejectionFeedback;
    }
    const idea = yield client_1.default.idea.update({
        where: { id },
        data: updateData,
        include: {
            creator: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
        },
    });
    return idea;
});
exports.ideaService = {
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
