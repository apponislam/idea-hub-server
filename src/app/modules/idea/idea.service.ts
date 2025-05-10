import prisma from "../../../prisma/client";
import { IdeaStatus, Prisma } from "../../../generated/prisma";
import AppError from "../../error/AppError";

const createIdea = async (data: { title: string; problemStatement: string; proposedSolution: string; description: string; images?: string[]; isPaid?: boolean; price?: number | null; creatorId: string; categoryIds: string[]; status: IdeaStatus }) => {
    const isActuallyPaid = data.isPaid && data.price !== null && data.price !== 0;
    const actualPrice = isActuallyPaid ? data.price : null;

    const categories = await prisma.category.findMany({
        where: {
            id: { in: data.categoryIds },
        },
    });

    if (categories.length !== data.categoryIds.length) {
        const missingIds = data.categoryIds.filter((id) => !categories.some((c) => c.id === id));
        throw new AppError(400, `Categories not found: ${missingIds.join(", ")}`);
    }

    const idea = await prisma.idea.create({
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
};

const getMyIdeas = async (
    creatorId: string,
    filters: {
        searchTerm?: string;
        status?: string;
        isPaid?: boolean;
        page?: number;
        limit?: number;
    }
) => {
    const { searchTerm, status, isPaid, page = 1, limit = 10 } = filters;
    const skip = (page - 1) * limit;

    const where: Prisma.IdeaWhereInput = {
        creatorId,
        isDeleted: false,
        ...(searchTerm && {
            OR: [{ title: { contains: searchTerm, mode: "insensitive" } }, { description: { contains: searchTerm, mode: "insensitive" } }, { problemStatement: { contains: searchTerm, mode: "insensitive" } }, { proposedSolution: { contains: searchTerm, mode: "insensitive" } }],
        }),
        ...(status && { status: status as IdeaStatus }), // cast status to IdeaStatus enum
        ...(typeof isPaid === "boolean" && { isPaid }),
    };

    const [ideas, total] = await Promise.all([
        prisma.idea.findMany({
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
        prisma.idea.count({ where }),
    ]);

    return {
        data: ideas,
        meta: {
            page,
            limit,
            total,
        },
    };
};

const getSingleIdea = async (ideaId: string, userId: string) => {
    const idea = await prisma.idea.findFirst({
        where: {
            id: ideaId,
            creatorId: userId, // Ensure user owns the idea
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
        throw new AppError(404, "Idea not found");
    }

    return idea;
};

const getAllIdeas = async (filters: { searchTerm?: string; category?: string; status?: string; isPaid?: boolean }) => {
    const { searchTerm, category, status, isPaid } = filters;

    const where: Prisma.IdeaWhereInput = {
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
        where.status = status as any;
    }

    if (isPaid !== undefined) {
        where.isPaid = isPaid;
    }

    const ideas = await prisma.idea.findMany({
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
    });

    return ideas;
};

const updateIdea = async (
    ideaId: string,
    data: {
        title?: string;
        problemStatement?: string;
        proposedSolution?: string;
        description?: string;
        images?: string[];
        isPaid?: boolean;
        price?: number | null;
        categoryIds?: string[];
        status?: IdeaStatus;
    },
    userId: string,
    userRole: string
) => {
    const existingIdea = await prisma.idea.findFirst({
        where: {
            id: ideaId,
            isDeleted: false,
        },
        include: { creator: true },
    });

    console.log(existingIdea);

    if (!existingIdea) {
        throw new AppError(404, "Idea not found");
    }

    const isOwner = existingIdea.creatorId === userId;
    const isAdmin = userRole === "ADMIN";

    if (!isOwner && !isAdmin) {
        throw new AppError(403, "You can only edit your own ideas");
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

    return await prisma.idea.update({
        where: { id: ideaId },
        data: {
            title,
            description: description?.trim(),
            problemStatement,
            proposedSolution,
            status,
            images,
            isPaid: isActuallyPaid,
            price: actualPrice,
            ...categoryUpdates,
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
};

const deleteIdea = async (ideaId: string, userId: string, userRole: string) => {
    const existingIdea = await prisma.idea.findFirst({
        where: {
            id: ideaId,
            isDeleted: false,
        },
    });

    if (!existingIdea) {
        throw new AppError(404, "Idea not found");
    }

    if (existingIdea.creatorId !== userId && userRole !== "ADMIN") {
        throw new AppError(403, "You can only delete your own ideas");
    }

    return await prisma.idea.update({
        where: { id: ideaId },
        data: {
            isDeleted: true,
        },
    });
};

// admin get

const getIdeasForAdmin = async (filters: any, pagination: any) => {
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;

    const where: Prisma.IdeaWhereInput = {
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

    const ideas = await prisma.idea.findMany({
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

    const total = await prisma.idea.count({ where });

    return {
        data: ideas,
        meta: {
            page,
            limit,
            total,
        },
    };
};

const updateIdeaStatus = async (
    id: string,
    status: IdeaStatus,
    rejectionFeedback?: string // Add optional parameter
) => {
    if (!Object.values(IdeaStatus).includes(status)) {
        throw new AppError(404, "Invalid status value");
    }

    const updateData: any = { status };
    if (status === "REJECTED" && rejectionFeedback) {
        updateData.rejectionFeedback = rejectionFeedback;
    }

    const idea = await prisma.idea.update({
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
};

export const ideaService = {
    createIdea,
    getMyIdeas,
    getSingleIdea,
    getAllIdeas,
    updateIdea,
    deleteIdea,
    getIdeasForAdmin,
    updateIdeaStatus,
};
