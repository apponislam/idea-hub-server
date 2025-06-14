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
exports.blogService = void 0;
const client_1 = __importDefault(require("../../../prisma/client"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const createBlog = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const blog = yield client_1.default.blog.create({
        data: {
            title: data.title,
            content: data.content,
            excerpt: data.excerpt,
            coverImage: data.coverImage,
            category: data.category,
            tags: data.tags,
            seo: data.seo,
            authorId: data.authorId,
        },
        include: {
            author: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                },
            },
        },
    });
    return blog;
});
const getMyBlogs = (authorId, filters) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm, category, page = 1, limit = 10 } = filters;
    const skip = (page - 1) * limit;
    const where = {
        authorId,
        isDeleted: false,
    };
    if (searchTerm) {
        where.OR = [{ title: { contains: searchTerm, mode: "insensitive" } }, { content: { contains: searchTerm, mode: "insensitive" } }, { excerpt: { contains: searchTerm, mode: "insensitive" } }];
    }
    if (category) {
        where.category = category;
    }
    const [blogs, total] = yield Promise.all([
        client_1.default.blog.findMany({
            where,
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                    },
                },
            },
            orderBy: {
                publishedAt: "desc",
            },
            skip,
            take: limit,
        }),
        client_1.default.blog.count({ where }),
    ]);
    return {
        data: blogs,
        meta: {
            page,
            limit,
            total,
        },
    };
});
const getSingleBlog = (blogId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const blog = yield client_1.default.blog.findFirst({
        where: {
            id: blogId,
            authorId: userId,
            isDeleted: false,
        },
        include: {
            author: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                },
            },
        },
    });
    if (!blog) {
        throw new AppError_1.default(404, "Blog not found");
    }
    return blog;
});
const getAllBlogs = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm, category } = filters;
    const page = Number(paginationOptions.page) || 1;
    const limit = Number(paginationOptions.limit) || 10;
    const skip = (page - 1) * limit;
    const where = {
        isDeleted: false,
    };
    if (searchTerm) {
        where.OR = [{ title: { contains: searchTerm, mode: "insensitive" } }, { content: { contains: searchTerm, mode: "insensitive" } }, { excerpt: { contains: searchTerm, mode: "insensitive" } }];
    }
    if (category) {
        where.category = category;
    }
    const [blogs, total] = yield Promise.all([
        client_1.default.blog.findMany({
            where,
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                    },
                },
            },
            orderBy: {
                publishedAt: "desc",
            },
            skip,
            take: limit,
        }),
        client_1.default.blog.count({ where }),
    ]);
    return {
        data: blogs,
        meta: {
            page,
            limit,
            total,
        },
    };
});
const getSingleBlogPublic = (blogId) => __awaiter(void 0, void 0, void 0, function* () {
    const blog = yield client_1.default.blog.findFirst({
        where: {
            id: blogId,
            isDeleted: false,
        },
        include: {
            author: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                },
            },
        },
    });
    if (!blog) {
        throw new AppError_1.default(404, "Blog not found");
    }
    // Increment view count
    yield client_1.default.blog.update({
        where: { id: blogId },
        data: {
            views: { increment: 1 },
        },
    });
    return blog;
});
const updateBlog = (blogId, data, userId, userRole) => __awaiter(void 0, void 0, void 0, function* () {
    const existingBlog = yield client_1.default.blog.findFirst({
        where: {
            id: blogId,
            isDeleted: false,
        },
    });
    if (!existingBlog) {
        throw new AppError_1.default(404, "Blog not found");
    }
    const isOwner = existingBlog.authorId === userId;
    const isAdmin = userRole === "ADMIN";
    if (!isOwner && !isAdmin) {
        throw new AppError_1.default(403, "You can only edit your own blogs");
    }
    return yield client_1.default.blog.update({
        where: { id: blogId },
        data: Object.assign(Object.assign({}, data), { updatedAt: new Date() }),
        include: {
            author: {
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
const deleteBlog = (blogId, userId, userRole) => __awaiter(void 0, void 0, void 0, function* () {
    const existingBlog = yield client_1.default.blog.findFirst({
        where: {
            id: blogId,
            isDeleted: false,
        },
    });
    if (!existingBlog) {
        throw new AppError_1.default(404, "Blog not found");
    }
    const isOwner = existingBlog.authorId === userId;
    const isAdmin = userRole === "ADMIN";
    if (!isOwner && !isAdmin) {
        throw new AppError_1.default(403, "You can only delete your own blogs");
    }
    return yield client_1.default.blog.update({
        where: { id: blogId },
        data: {
            isDeleted: true,
            updatedAt: new Date(),
        },
    });
});
// Admin services
const getBlogsForAdmin = (filters, pagination) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm, category } = filters;
    const page = Number(pagination.page) || 1;
    const limit = Number(pagination.limit) || 10;
    const skip = (page - 1) * limit;
    const where = { isDeleted: false };
    if (searchTerm) {
        where.OR = [{ title: { contains: searchTerm, mode: "insensitive" } }, { content: { contains: searchTerm, mode: "insensitive" } }, { excerpt: { contains: searchTerm, mode: "insensitive" } }];
    }
    if (category) {
        where.category = category;
    }
    const [blogs, total] = yield Promise.all([
        client_1.default.blog.findMany({
            where,
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                    },
                },
            },
            orderBy: {
                publishedAt: "desc",
            },
            skip,
            take: limit,
        }),
        client_1.default.blog.count({ where }),
    ]);
    return {
        data: blogs,
        meta: {
            page,
            limit,
            total,
        },
    };
});
const getSingleBlogForAdmin = (blogId) => __awaiter(void 0, void 0, void 0, function* () {
    const blog = yield client_1.default.blog.findUnique({
        where: { id: blogId },
        include: {
            author: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                },
            },
        },
    });
    if (!blog) {
        throw new AppError_1.default(404, "Blog not found");
    }
    return blog;
});
exports.blogService = {
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
