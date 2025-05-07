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
            email: userData.email,
            role: userData.role,
        },
        config.jwt_secret as Secret,
        config.jwt_secret_expire as string
    );

    const refreshToken = jwtHelper.generateToken(
        {
            email: userData.email,
            role: userData.role,
        },
        config.jwt_refresh_secret as Secret,
        config.jwt_refresh_secret_expire as string
    );

    return {
        accessToken,
        refreshToken,
    };
};

export const authServices = {
    loginUser,
};
