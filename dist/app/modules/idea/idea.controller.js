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
exports.ideaController = void 0;
const idea_service_1 = require("./idea.service");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const createIdea = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        throw new AppError_1.default(404, "User not found");
    }
    const idea = yield idea_service_1.ideaService.createIdea(Object.assign(Object.assign({}, req.body), { creatorId: req.user.id, categoryIds: req.body.categoryIds }));
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Idea created successfully",
        data: idea,
    });
}));
const getMyIdeas = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        throw new AppError_1.default(401, "Unauthorized");
    }
    const filters = {
        searchTerm: req.query.search,
        status: req.query.status,
        isPaid: req.query.isPaid ? req.query.isPaid === "true" : undefined,
        page: Number(req.query.page) || 1,
        limit: Number(req.query.limit) || 10,
    };
    const result = yield idea_service_1.ideaService.getMyIdeas(req.user.id, filters);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Your ideas retrieved successfully",
        data: result.data,
        meta: result.meta,
    });
}));
const getSingleIdea = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        throw new AppError_1.default(401, "Unauthorized");
    }
    const idea = yield idea_service_1.ideaService.getSingleIdea(req.params.id, req.user.id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Idea retrieved successfully",
        data: idea,
    });
}));
const getAllIdeas = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = {
        searchTerm: req.query.search,
        category: req.query.category,
        status: req.query.status,
        isPaid: req.query.isPaid ? req.query.isPaid === "true" : undefined,
    };
    const paginationOptions = {
        page: Number(req.query.page) || 1,
        limit: Number(req.query.limit) || 10,
    };
    const result = yield idea_service_1.ideaService.getAllIdeas(filters, paginationOptions);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Ideas retrieved successfully",
        data: result.data,
        meta: result.meta,
    });
}));
const getSingleIdeaPublic = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ideaid } = req.params;
    console.log(ideaid);
    const idea = yield idea_service_1.ideaService.getSingleIdeaPublic(ideaid);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Idea retrieved successfully",
        data: idea,
    });
}));
const updateIdea = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        throw new AppError_1.default(401, "Unauthorized");
    }
    // console.log(req.body);
    const idea = yield idea_service_1.ideaService.updateIdea(req.params.id, req.body, req.user.id, req.user.role);
    console.log(idea);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Idea updated successfully",
        data: idea,
    });
}));
const deleteIdea = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        throw new AppError_1.default(401, "Unauthorized");
    }
    const result = yield idea_service_1.ideaService.deleteIdea(req.params.id, req.user.id, req.user.role);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Idea deleted successfully",
        data: result,
    });
}));
// admin actions
const getIdeasForAdmin = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = {
        searchTerm: req.query.search,
        category: req.query.category,
        status: req.query.status,
        isPaid: req.query.isPaid ? req.query.isPaid === "true" : undefined,
    };
    const pagination = {
        page: Number(req.query.page) || 1,
        limit: Number(req.query.limit) || 10,
    };
    const result = yield idea_service_1.ideaService.getIdeasForAdmin(filters, pagination);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Ideas retrieved successfully",
        data: result.data,
        meta: result.meta,
    });
}));
const getSingleIdeaForAdmin = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!req.user || req.user.role !== "ADMIN") {
        throw new AppError_1.default(403, "You are not authorized to view this idea");
    }
    const idea = yield idea_service_1.ideaService.getSingleIdeaForAdmin(id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Idea retrieved successfully",
        data: idea,
    });
}));
const updateIdeaStatus = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { status, rejectionFeedback } = req.body; // Add rejectionFeedback
    const user = req.user;
    if (!req.user) {
        throw new AppError_1.default(401, "Unauthorized");
    }
    if ((user === null || user === void 0 ? void 0 : user.role) !== "ADMIN") {
        throw new AppError_1.default(403, "You are not authorized to update idea status");
    }
    // Require rejectionFeedback when status is REJECTED
    if (status === "REJECTED" && !rejectionFeedback) {
        throw new AppError_1.default(400, "Rejection feedback is required");
    }
    const result = yield idea_service_1.ideaService.updateIdeaStatus(id, status, status === "REJECTED" ? rejectionFeedback : undefined // Pass feedback if rejected
    );
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Idea status updated successfully",
        data: result,
    });
}));
exports.ideaController = {
    createIdea,
    getMyIdeas,
    getSingleIdea,
    getAllIdeas,
    getSingleIdeaPublic,
    updateIdea,
    deleteIdea,
    getIdeasForAdmin,
    getSingleIdeaForAdmin,
    updateIdeaStatus,
};
