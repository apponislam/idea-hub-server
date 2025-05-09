import { Secret } from "jsonwebtoken";
import { userStatus } from "../../../generated/prisma";
import prisma from "../../../prisma/client";
import { jwtHelper } from "../../helpers/jwtHelper";
import bcrypt from "bcrypt";
import config from "../../config";

const loginUser = async (payload: { email: string; password: string }) => {
    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: payload.email,
            status: userStatus.ACTIVE,
        },
    });

    const isCorrectPassword: boolean = await bcrypt.compare(payload.password, userData.password);

    if (!isCorrectPassword) {
        throw new Error("Password incorrect!");
    }
    const accessToken = jwtHelper.generateToken(
        {
            id: userData.id,
            name: userData.name,
            email: userData.email,
            image: userData.image,
            role: userData.role,
            status: userData.status,
        },
        config.jwt_secret as Secret,
        config.jwt_secret_expire as string
    );

    const refreshToken = jwtHelper.generateToken(
        {
            id: userData.id,
            name: userData.name,
            email: userData.email,
            image: userData.image,
            role: userData.role,
            status: userData.status,
        },
        config.jwt_refresh_secret as Secret,
        config.jwt_refresh_secret_expire as string
    );

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
};

const refreshToken = async (token: string) => {
    let decodedData;
    try {
        decodedData = jwtHelper.verifyToken(token, config.jwt_refresh_secret as Secret);
    } catch (err) {
        throw new Error("You are not authorized!");
    }

    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: decodedData.email,
            status: userStatus.ACTIVE,
        },
    });

    const accessToken = jwtHelper.generateToken(
        {
            id: userData.id,
            name: userData.name,
            email: userData.email,
            image: userData.image,
            role: userData.role,
            status: userData.status,
        },
        config.jwt_secret as Secret,
        config.jwt_secret_expire as string
    );

    return {
        accessToken,
    };
};

export const authServices = {
    loginUser,
    refreshToken,
};
