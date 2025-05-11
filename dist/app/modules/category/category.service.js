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
exports.categoryService = void 0;
const client_1 = __importDefault(require("../../../prisma/client"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const createCategory = (name) => __awaiter(void 0, void 0, void 0, function* () {
    const existingCategory = yield client_1.default.category.findUnique({
        where: { name },
    });
    if (existingCategory) {
        throw new AppError_1.default(400, "Category already exists");
    }
    return yield client_1.default.category.create({
        data: { name },
    });
});
const getAllCategories = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield client_1.default.category.findMany({
        orderBy: {
            createdAt: "desc",
        },
    });
});
const getCategoryById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const category = yield client_1.default.category.findUnique({
        where: { id },
    });
    if (!category) {
        throw new AppError_1.default(404, "Category not found");
    }
    return category;
});
const updateCategory = (id, name) => __awaiter(void 0, void 0, void 0, function* () {
    const existingCategory = yield client_1.default.category.findUnique({
        where: { name },
    });
    if (existingCategory && existingCategory.id !== id) {
        throw new AppError_1.default(400, "Category name already exists");
    }
    return yield client_1.default.category.update({
        where: { id },
        data: { name },
    });
});
const deleteCategory = (categoryId) => __awaiter(void 0, void 0, void 0, function* () {
    const ideasWithCategory = yield client_1.default.ideaCategory.findFirst({
        where: { categoryId },
    });
    if (ideasWithCategory) {
        throw new AppError_1.default(400, "Cannot delete category - it's being used by ideas");
    }
    return yield client_1.default.category.delete({
        where: { id: categoryId },
    });
});
exports.categoryService = {
    createCategory,
    getAllCategories,
    deleteCategory,
    getCategoryById,
    updateCategory,
};
