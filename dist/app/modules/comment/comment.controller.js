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
exports.commentController = void 0;
const comment_service_1 = require("./comment.service");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const createComment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        throw new AppError_1.default(401, "Unauthorized");
    }
    const { ideaId } = req.params;
    const { content, parentCommentId } = req.body;
    const comment = yield comment_service_1.commentService.createComment(ideaId, req.user.id, content, parentCommentId);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Comment created successfully",
        data: comment,
    });
}));
const getComments = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ideaId } = req.params;
    const comments = yield comment_service_1.commentService.getCommentsByIdea(ideaId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Comments retrieved successfully",
        data: comments,
    });
}));
const updateComment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        throw new AppError_1.default(401, "Unauthorized");
    }
    const { commentId } = req.params;
    const { content } = req.body;
    const comment = yield comment_service_1.commentService.updateComment(commentId, req.user.id, req.user.role, content);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Comment updated successfully",
        data: comment,
    });
}));
const deleteComment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        throw new AppError_1.default(401, "Unauthorized");
    }
    const { commentId } = req.params;
    const result = yield comment_service_1.commentService.deleteComment(commentId, req.user.id, req.user.role);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Comment deleted successfully",
        data: result,
    });
}));
exports.commentController = {
    createComment,
    getComments,
    updateComment,
    deleteComment,
};
