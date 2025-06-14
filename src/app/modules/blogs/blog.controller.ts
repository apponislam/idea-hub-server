import { Request, Response } from "express";
import { blogService } from "./blog.service";
import sendResponse from "../../utils/sendResponse";
import catchAsync from "../../utils/catchAsync";
import AppError from "../../error/AppError";

const createBlog = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) {
        throw new AppError(401, "Unauthorized");
    }

    const blog = await blogService.createBlog({
        ...req.body,
        authorId: req.user.id,
    });

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Blog created successfully",
        data: blog,
    });
});

const getMyBlogs = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) {
        throw new AppError(401, "Unauthorized");
    }

    const filters = {
        searchTerm: req.query.search as string,
        category: req.query.category as string,
        page: Number(req.query.page) || 1,
        limit: Number(req.query.limit) || 10,
    };

    const result = await blogService.getMyBlogs(req.user.id, filters);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Your blogs retrieved successfully",
        data: result.data,
        meta: result.meta,
    });
});

const getSingleBlog = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) {
        throw new AppError(401, "Unauthorized");
    }

    const blog = await blogService.getSingleBlog(req.params.id, req.user.id);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Blog retrieved successfully",
        data: blog,
    });
});

const getAllBlogs = catchAsync(async (req: Request, res: Response) => {
    const filters = {
        searchTerm: req.query.search as string,
        category: req.query.category as string,
    };

    const paginationOptions = {
        page: Number(req.query.page) || 1,
        limit: Number(req.query.limit) || 10,
    };

    const result = await blogService.getAllBlogs(filters, paginationOptions);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Blogs retrieved successfully",
        data: result.data,
        meta: result.meta,
    });
});

const getSingleBlogPublic = catchAsync(async (req: Request, res: Response) => {
    const blog = await blogService.getSingleBlogPublic(req.params.blogId);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Blog retrieved successfully",
        data: blog,
    });
});

const updateBlog = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) {
        throw new AppError(401, "Unauthorized");
    }

    const blog = await blogService.updateBlog(req.params.id, req.body, req.user.id, req.user.role);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Blog updated successfully",
        data: blog,
    });
});

const deleteBlog = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) {
        throw new AppError(401, "Unauthorized");
    }

    const result = await blogService.deleteBlog(req.params.id, req.user.id, req.user.role);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Blog deleted successfully",
        data: result,
    });
});

// Admin controllers
const getBlogsForAdmin = catchAsync(async (req: Request, res: Response) => {
    const filters = {
        searchTerm: req.query.search as string,
        category: req.query.category as string,
    };

    const pagination = {
        page: Number(req.query.page) || 1,
        limit: Number(req.query.limit) || 10,
    };

    const result = await blogService.getBlogsForAdmin(filters, pagination);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Blogs retrieved successfully",
        data: result.data,
        meta: result.meta,
    });
});

const getSingleBlogForAdmin = catchAsync(async (req: Request, res: Response) => {
    const blog = await blogService.getSingleBlogForAdmin(req.params.id);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Blog retrieved successfully",
        data: blog,
    });
});

export const blogController = {
    createBlog,
    getMyBlogs,
    getSingleBlog,
    getAllBlogs,
    getSingleBlogPublic,
    updateBlog,
    deleteBlog,
    getBlogsForAdmin,
    getSingleBlogForAdmin,
};
