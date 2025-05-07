import prisma from "../../../prisma/client";

const createIdea = async (data: { title: string; problemStatement: string; proposedSolution: string; description: string; images?: string[]; isPaid?: boolean; price?: number; creatorId: string; categoryIds: string[] }) => {
    const idea = await prisma.idea.create({
        data: {
            title: data.title,
            problemStatement: data.problemStatement,
            proposedSolution: data.proposedSolution,
            description: data.description,
            images: data.images || [],
            isPaid: data.isPaid || false,
            price: data.isPaid ? data.price : null,
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

export const ideaService = {
    createIdea,
};
