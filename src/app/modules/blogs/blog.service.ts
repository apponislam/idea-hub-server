import prisma from "../../../prisma/client";
import AppError from "../../error/AppError";

const createBlog = async (data: {
    title: string;
    content: string;
    excerpt: string;
    coverImage: string;
    category: string;
    tags: string[];
    seo: {
        description: string;
        keywords: string[];
    };
    authorId: string;
}) => {
    const blog = await prisma.blog.create({
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
};

const getMyBlogs = async (
    authorId: string,
    filters: {
        searchTerm?: string;
        category?: string;
        page?: number;
        limit?: number;
    }
) => {
    const { searchTerm, category, page = 1, limit = 10 } = filters;
    const skip = (page - 1) * limit;

    const where: any = {
        authorId,
        isDeleted: false,
    };

    if (searchTerm) {
        where.OR = [{ title: { contains: searchTerm, mode: "insensitive" } }, { content: { contains: searchTerm, mode: "insensitive" } }, { excerpt: { contains: searchTerm, mode: "insensitive" } }];
    }

    if (category) {
        where.category = category;
    }

    const [blogs, total] = await Promise.all([
        prisma.blog.findMany({
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
        prisma.blog.count({ where }),
    ]);

    return {
        data: blogs,
        meta: {
            page,
            limit,
            total,
        },
    };
};

const getSingleBlog = async (blogId: string, userId: string) => {
    const blog = await prisma.blog.findFirst({
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
        throw new AppError(404, "Blog not found");
    }

    return blog;
};

const getAllBlogs = async (
    filters: {
        searchTerm?: string;
        category?: string;
    },
    paginationOptions: {
        page?: number;
        limit?: number;
    }
) => {
    const { searchTerm, category } = filters;
    const page = Number(paginationOptions.page) || 1;
    const limit = Number(paginationOptions.limit) || 10;
    const skip = (page - 1) * limit;

    const where: any = {
        isDeleted: false,
    };

    if (searchTerm) {
        where.OR = [{ title: { contains: searchTerm, mode: "insensitive" } }, { content: { contains: searchTerm, mode: "insensitive" } }, { excerpt: { contains: searchTerm, mode: "insensitive" } }];
    }

    if (category) {
        where.category = category;
    }

    const [blogs, total] = await Promise.all([
        prisma.blog.findMany({
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
        prisma.blog.count({ where }),
    ]);

    return {
        data: blogs,
        meta: {
            page,
            limit,
            total,
        },
    };
};

const getSingleBlogPublic = async (blogId: string) => {
    const blog = await prisma.blog.findFirst({
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
        throw new AppError(404, "Blog not found");
    }

    // Increment view count
    await prisma.blog.update({
        where: { id: blogId },
        data: {
            views: { increment: 1 },
        },
    });

    return blog;
};

const updateBlog = async (
    blogId: string,
    data: {
        title?: string;
        content?: string;
        excerpt?: string;
        coverImage?: string;
        category?: string;
        tags?: string[];
        seo?: {
            description: string;
            keywords: string[];
        };
    },
    userId: string,
    userRole: string
) => {
    const existingBlog = await prisma.blog.findFirst({
        where: {
            id: blogId,
            isDeleted: false,
        },
    });

    if (!existingBlog) {
        throw new AppError(404, "Blog not found");
    }

    const isOwner = existingBlog.authorId === userId;
    const isAdmin = userRole === "ADMIN";

    if (!isOwner && !isAdmin) {
        throw new AppError(403, "You can only edit your own blogs");
    }

    return await prisma.blog.update({
        where: { id: blogId },
        data: {
            ...data,
            updatedAt: new Date(),
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
};

const deleteBlog = async (blogId: string, userId: string, userRole: string) => {
    const existingBlog = await prisma.blog.findFirst({
        where: {
            id: blogId,
            isDeleted: false,
        },
    });

    if (!existingBlog) {
        throw new AppError(404, "Blog not found");
    }

    const isOwner = existingBlog.authorId === userId;
    const isAdmin = userRole === "ADMIN";

    if (!isOwner && !isAdmin) {
        throw new AppError(403, "You can only delete your own blogs");
    }

    return await prisma.blog.update({
        where: { id: blogId },
        data: {
            isDeleted: true,
            updatedAt: new Date(),
        },
    });
};

// Admin services
const getBlogsForAdmin = async (
    filters: {
        searchTerm?: string;
        category?: string;
    },
    pagination: {
        page?: number;
        limit?: number;
    }
) => {
    const { searchTerm, category } = filters;
    const page = Number(pagination.page) || 1;
    const limit = Number(pagination.limit) || 10;
    const skip = (page - 1) * limit;

    const where: any = { isDeleted: false };

    if (searchTerm) {
        where.OR = [{ title: { contains: searchTerm, mode: "insensitive" } }, { content: { contains: searchTerm, mode: "insensitive" } }, { excerpt: { contains: searchTerm, mode: "insensitive" } }];
    }

    if (category) {
        where.category = category;
    }

    const [blogs, total] = await Promise.all([
        prisma.blog.findMany({
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
        prisma.blog.count({ where }),
    ]);

    return {
        data: blogs,
        meta: {
            page,
            limit,
            total,
        },
    };
};

const getSingleBlogForAdmin = async (blogId: string) => {
    const blog = await prisma.blog.findUnique({
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
        throw new AppError(404, "Blog not found");
    }

    return blog;
};

export const blogService = {
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
