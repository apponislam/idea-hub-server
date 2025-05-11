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
exports.categoryController = void 0;
const category_service_1 = require("./category.service");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const createCategory = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        throw new AppError_1.default(401, "Unauthorized");
    }
    const userRole = req.user.role;
    if (userRole !== "ADMIN") {
        throw new AppError_1.default(403, "You don't have admin privileges");
    }
    const { name } = req.body;
    const category = yield category_service_1.categoryService.createCategory(name);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Category created successfully",
        data: category,
    });
}));
const getCategories = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const categories = yield category_service_1.categoryService.getAllCategories();
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Categories retrieved successfully",
        data: categories,
    });
}));
const getSingleCategory = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const category = yield category_service_1.categoryService.getCategoryById(id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Category retrieved successfully",
        data: category,
    });
}));
const updateCategory = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        throw new AppError_1.default(401, "Unauthorized");
    }
    const userRole = req.user.role;
    if (userRole !== "ADMIN") {
        throw new AppError_1.default(403, "You don't have admin privileges");
    }
    const { id } = req.params;
    const { name } = req.body;
    const category = yield category_service_1.categoryService.updateCategory(id, name);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Category updated successfully",
        data: category,
    });
}));
const deleteCategory = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        throw new AppError_1.default(401, "Unauthorized");
    }
    const userRole = req.user.role;
    if (userRole !== "ADMIN") {
        throw new AppError_1.default(403, "You don't have admin privileges");
    }
    const { id } = req.params;
    const result = yield category_service_1.categoryService.deleteCategory(id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Category deleted successfully",
        data: result,
    });
}));
exports.categoryController = {
    createCategory,
    getCategories,
    deleteCategory,
    getSingleCategory,
    updateCategory,
};
