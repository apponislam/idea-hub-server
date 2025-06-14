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
exports.userService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const client_1 = __importDefault(require("../../../prisma/client"));
const config_1 = __importDefault(require("../../config"));
const prisma_1 = require("../../../../generated/prisma");
const createUser = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const hashedPassword = yield bcrypt_1.default.hash(data.password, Number(config_1.default.bcrypt_salt_rounds));
    const user = yield client_1.default.user.create({
        data: {
            name: data.name,
            email: data.email,
            image: data.image || null,
            password: hashedPassword,
            role: prisma_1.Role.MEMBER,
        },
        select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true,
        },
    });
    return user;
});
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield client_1.default.user.findMany({
        where: {
            status: {
                in: ["ACTIVE", "BLOCKED"],
            },
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
            createdAt: true,
            image: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
});
const getUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield client_1.default.user.findUniqueOrThrow({
        where: {
            id,
            status: {
                in: ["ACTIVE", "BLOCKED"],
            },
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
            createdAt: true,
            updatedAt: true,
            image: true,
            _count: {
                select: {
                    ideas: true,
                    votes: true,
                    comments: true,
                    payments: true,
                    blogs: {
                        where: {
                            isDeleted: false,
                        },
                    },
                },
            },
        },
    });
});
const updateUserRole = (userId, role) => __awaiter(void 0, void 0, void 0, function* () {
    return yield client_1.default.user.update({
        where: { id: userId },
        data: { role },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
        },
    });
});
const activateUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield client_1.default.user.update({
        where: { id: userId },
        data: { status: "ACTIVE" },
        select: {
            id: true,
            name: true,
            email: true,
            status: true,
        },
    });
});
const deactivateUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield client_1.default.user.update({
        where: { id: userId },
        data: { status: "BLOCKED" },
        select: {
            id: true,
            name: true,
            email: true,
            status: true,
        },
    });
});
const deleteUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield client_1.default.user.update({
        where: { id: userId },
        data: { status: "DELECTED" },
        select: {
            id: true,
            name: true,
            email: true,
            status: true,
        },
    });
});
exports.userService = {
    createUser,
    getAllUsers,
    getUser,
    updateUserRole,
    activateUser,
    deactivateUser,
    deleteUser,
};
