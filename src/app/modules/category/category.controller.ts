import { Request, Response } from "express";
import { categoryService } from "./category.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import AppError from "../../error/AppError";

const createCategory = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) {
        throw new AppError(401, "Unauthorized");
    }
    const userRole = req.user.role;

    if (userRole !== "ADMIN") {
        throw new AppError(403, "You don't have admin privileges");
    }

    const { name } = req.body;
    const category = await categoryService.createCategory(name);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Category created successfully",
        data: category,
    });
});

const getCategories = catchAsync(async (req: Request, res: Response) => {
    const categories = await categoryService.getAllCategories();

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Categories retrieved successfully",
        data: categories,
    });
});

const getSingleCategory = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const category = await categoryService.getCategoryById(id);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Category retrieved successfully",
        data: category,
    });
});

const updateCategory = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) {
        throw new AppError(401, "Unauthorized");
    }
    const userRole = req.user.role;

    if (userRole !== "ADMIN") {
        throw new AppError(403, "You don't have admin privileges");
    }

    const { id } = req.params;
    const { name } = req.body;
    const category = await categoryService.updateCategory(id, name);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Category updated successfully",
        data: category,
    });
});

const deleteCategory = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) {
        throw new AppError(401, "Unauthorized");
    }
    const userRole = req.user.role;

    if (userRole !== "ADMIN") {
        throw new AppError(403, "You don't have admin privileges");
    }

    const { id } = req.params;
    const result = await categoryService.deleteCategory(id);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Category deleted successfully",
        data: result,
    });
});

export const categoryController = {
    createCategory,
    getCategories,
    deleteCategory,
    getSingleCategory,
    updateCategory,
};
