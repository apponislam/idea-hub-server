import { NextFunction, Request, Response } from "express";
import { Secret } from "jsonwebtoken";
import AppError from "../error/AppError";
import { jwtHelper } from "../helpers/jwtHelper";
import config from "../config";
import catchAsync from "../utils/catchAsync";
import prisma from "../../prisma/client";

const auth = () => {
    return catchAsync(async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
        const token = req.headers.authorization;

        console.log(req.headers);

        if (!token) {
            throw new AppError(401, "You are not authorized!");
        }

        const decoded = jwtHelper.verifyToken(token, config.jwt_secret as Secret);

        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
        });

        if (!user) {
            throw new AppError(404, "User not found");
        }

        const { password, ...safeUser } = user;

        req.user = safeUser;

        next();
    });
};

export default auth;
