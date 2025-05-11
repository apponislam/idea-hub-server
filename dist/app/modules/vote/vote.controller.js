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
exports.voteController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const vote_service_1 = require("./vote.service");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const vote = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        throw new AppError_1.default(401, "Unauthorized");
    }
    const { ideaId } = req.params;
    const { type } = req.body;
    if (!["UPVOTE", "DOWNVOTE"].includes(type)) {
        throw new AppError_1.default(400, "Invalid vote type");
    }
    const result = yield vote_service_1.voteService.voteIdea(ideaId, req.user.id, type);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: `Vote ${result.action} successfully`,
        data: {
            action: result.action,
            voteType: result.voteType,
        },
    });
}));
const getVote = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        throw new AppError_1.default(401, "Unauthorized");
    }
    const { ideaId } = req.params;
    const vote = yield vote_service_1.voteService.getUserVote(ideaId, req.user.id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Vote retrieved successfully",
        data: vote,
    });
}));
exports.voteController = {
    vote,
    getVote,
};
