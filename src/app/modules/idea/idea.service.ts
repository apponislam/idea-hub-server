import prisma from "../../../prisma/client";
import { Prisma } from "../../../generated/prisma";
import AppError from "../../error/AppError";

const createIdea = async (data: { title: string; problemStatement: string; proposedSolution: string; description: string; images?: string[]; isPaid?: boolean; price?: number | null; creatorId: string; categoryIds: string[] }) => {
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
            status: "DRAFT",
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

    if (!existingIdea) {
        throw new AppError(404, "Idea not found");
    }

    if (existingIdea.creatorId !== userId && userRole !== "ADMIN") {
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

    const isActuallyPaid = data.isPaid && data.price !== null && data.price !== 0;
    const actualPrice = isActuallyPaid ? data.price : null;

    return await prisma.idea.update({
        where: { id: ideaId },
        data: {
            ...data,
            isPaid: isActuallyPaid,
            price: actualPrice,
            ...categoryUpdates,
            status: "DRAFT",
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

export const ideaService = {
    createIdea,
    getAllIdeas,
    updateIdea,
    deleteIdea,
};
