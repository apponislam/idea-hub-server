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
exports.authServices = void 0;
const prisma_1 = require("../../../generated/prisma");
const client_1 = __importDefault(require("../../../prisma/client"));
const jwtHelper_1 = require("../../helpers/jwtHelper");
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = __importDefault(require("../../config"));
const loginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield client_1.default.user.findUniqueOrThrow({
        where: {
            email: payload.email,
            status: prisma_1.userStatus.ACTIVE,
        },
    });
    const isCorrectPassword = yield bcrypt_1.default.compare(payload.password, userData.password);
    if (!isCorrectPassword) {
        throw new Error("Password incorrect!");
    }
    const accessToken = jwtHelper_1.jwtHelper.generateToken({
        id: userData.id,
        name: userData.name,
        email: userData.email,
        image: userData.image,
        role: userData.role,
        status: userData.status,
    }, config_1.default.jwt_secret, config_1.default.jwt_secret_expire);
    const refreshToken = jwtHelper_1.jwtHelper.generateToken({
        id: userData.id,
        name: userData.name,
        email: userData.email,
        image: userData.image,
        role: userData.role,
        status: userData.status,
    }, config_1.default.jwt_refresh_secret, config_1.default.jwt_refresh_secret_expire);
    const user = {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        image: userData.image,
        role: userData.role,
        status: userData.status,
    };
    return {
        user,
        accessToken,
        refreshToken,
    };
});
const refreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    let decodedData;
    try {
        decodedData = jwtHelper_1.jwtHelper.verifyToken(token, config_1.default.jwt_refresh_secret);
    }
    catch (err) {
        throw new Error("You are not authorized!");
    }
    const userData = yield client_1.default.user.findUniqueOrThrow({
        where: {
            email: decodedData.email,
            status: prisma_1.userStatus.ACTIVE,
        },
    });
    const accessToken = jwtHelper_1.jwtHelper.generateToken({
        id: userData.id,
        name: userData.name,
        email: userData.email,
        image: userData.image,
        role: userData.role,
        status: userData.status,
    }, config_1.default.jwt_secret, config_1.default.jwt_secret_expire);
    return {
        accessToken,
    };
});
exports.authServices = {
    loginUser,
    refreshToken,
};
