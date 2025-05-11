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
exports.voteService = void 0;
const client_1 = __importDefault(require("../../../prisma/client"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const voteIdea = (ideaId, userId, voteType) => __awaiter(void 0, void 0, void 0, function* () {
    const idea = yield client_1.default.idea.findFirst({
        where: {
            id: ideaId,
            isDeleted: false,
        },
    });
    if (!idea) {
        throw new AppError_1.default(404, "Idea not found");
    }
    const existingVote = yield client_1.default.vote.findUnique({
        where: {
            userId_ideaId: {
                userId,
                ideaId,
            },
        },
    });
    if (existingVote && existingVote.type === voteType) {
        yield client_1.default.vote.delete({
            where: {
                id: existingVote.id,
            },
        });
        return { action: "removed", voteType: null };
    }
    if (existingVote) {
        const updatedVote = yield client_1.default.vote.update({
            where: {
                id: existingVote.id,
            },
            data: {
                type: voteType,
            },
        });
        return { action: "updated", voteType };
    }
    const newVote = yield client_1.default.vote.create({
        data: {
            userId,
            ideaId,
            type: voteType,
        },
    });
    return { action: "created", voteType };
});
const getUserVote = (ideaId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield client_1.default.vote.findUnique({
        where: {
            userId_ideaId: {
                userId,
                ideaId,
            },
        },
    });
});
exports.voteService = {
    voteIdea,
    getUserVote,
};
