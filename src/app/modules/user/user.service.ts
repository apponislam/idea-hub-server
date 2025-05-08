import bcrypt from "bcrypt";
import prisma from "../../../prisma/client";
import config from "../../config";
import { Role } from "../../../generated/prisma";

const createUser = async (data: { name: string; email: string; password: string; image?: string }) => {
    const hashedPassword = await bcrypt.hash(data.password, Number(config.bcrypt_salt_rounds));

    const user = await prisma.user.create({
        data: {
            name: data.name,
            email: data.email,
            image: data.image || null,
            password: hashedPassword,
            role: Role.MEMBER,
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
};

export const userService = {
    createUser,
};
