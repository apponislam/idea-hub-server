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
exports.blogController = void 0;
const blog_service_1 = require("./blog.service");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const createBlog = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        throw new AppError_1.default(401, "Unauthorized");
    }
    const blog = yield blog_service_1.blogService.createBlog(Object.assign(Object.assign({}, req.body), { authorId: req.user.id }));
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Blog created successfully",
        data: blog,
    });
}));
const getMyBlogs = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        throw new AppError_1.default(401, "Unauthorized");
    }
    const filters = {
        searchTerm: req.query.search,
        category: req.query.category,
        page: Number(req.query.page) || 1,
        limit: Number(req.query.limit) || 10,
    };
    const result = yield blog_service_1.blogService.getMyBlogs(req.user.id, filters);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Your blogs retrieved successfully",
        data: result.data,
        meta: result.meta,
    });
}));
const getSingleBlog = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        throw new AppError_1.default(401, "Unauthorized");
    }
    const blog = yield blog_service_1.blogService.getSingleBlog(req.params.id, req.user.id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Blog retrieved successfully",
        data: blog,
    });
}));
const getAllBlogs = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = {
        searchTerm: req.query.search,
        category: req.query.category,
    };
    const paginationOptions = {
        page: Number(req.query.page) || 1,
        limit: Number(req.query.limit) || 10,
    };
    const result = yield blog_service_1.blogService.getAllBlogs(filters, paginationOptions);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Blogs retrieved successfully",
        data: result.data,
        meta: result.meta,
    });
}));
const getSingleBlogPublic = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const blog = yield blog_service_1.blogService.getSingleBlogPublic(req.params.blogId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Blog retrieved successfully",
        data: blog,
    });
}));
const updateBlog = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        throw new AppError_1.default(401, "Unauthorized");
    }
    const blog = yield blog_service_1.blogService.updateBlog(req.params.id, req.body, req.user.id, req.user.role);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Blog updated successfully",
        data: blog,
    });
}));
const deleteBlog = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        throw new AppError_1.default(401, "Unauthorized");
    }
    const result = yield blog_service_1.blogService.deleteBlog(req.params.id, req.user.id, req.user.role);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Blog deleted successfully",
        data: result,
    });
}));
// Admin controllers
const getBlogsForAdmin = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = {
        searchTerm: req.query.search,
        category: req.query.category,
    };
    const pagination = {
        page: Number(req.query.page) || 1,
        limit: Number(req.query.limit) || 10,
    };
    const result = yield blog_service_1.blogService.getBlogsForAdmin(filters, pagination);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Blogs retrieved successfully",
        data: result.data,
        meta: result.meta,
    });
}));
const getSingleBlogForAdmin = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const blog = yield blog_service_1.blogService.getSingleBlogForAdmin(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Blog retrieved successfully",
        data: blog,
    });
}));
exports.blogController = {
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
