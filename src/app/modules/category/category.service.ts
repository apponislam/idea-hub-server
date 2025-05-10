import prisma from "../../../prisma/client";
import AppError from "../../error/AppError";

const createCategory = async (name: string) => {
    const existingCategory = await prisma.category.findUnique({
        where: { name },
    });

    if (existingCategory) {
        throw new AppError(400, "Category already exists");
    }

    return await prisma.category.create({
        data: { name },
    });
};

const getAllCategories = async () => {
    return await prisma.category.findMany({
        orderBy: {
            createdAt: "desc",
        },
    });
};

const getCategoryById = async (id: string) => {
    const category = await prisma.category.findUnique({
        where: { id },
    });

    if (!category) {
        throw new AppError(404, "Category not found");
    }

    return category;
};

const updateCategory = async (id: string, name: string) => {
    const existingCategory = await prisma.category.findUnique({
        where: { name },
    });

    if (existingCategory && existingCategory.id !== id) {
        throw new AppError(400, "Category name already exists");
    }

    return await prisma.category.update({
        where: { id },
        data: { name },
    });
};

const deleteCategory = async (categoryId: string) => {
    const ideasWithCategory = await prisma.ideaCategory.findFirst({
        where: { categoryId },
    });

    if (ideasWithCategory) {
        throw new AppError(400, "Cannot delete category - it's being used by ideas");
    }

    return await prisma.category.delete({
        where: { id: categoryId },
    });
};

export const categoryService = {
    createCategory,
    getAllCategories,
    deleteCategory,
    getCategoryById,
    updateCategory,
};
