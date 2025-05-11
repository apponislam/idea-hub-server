import bcrypt from "bcrypt";
import prisma from "../../../prisma/client";
import config from "../../config";
import { Role } from "../../../../generated/prisma";

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

const getAllUsers = async () => {
    return await prisma.user.findMany({
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
};

const updateUserRole = async (userId: string, role: Role) => {
    return await prisma.user.update({
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
};

const activateUser = async (userId: string) => {
    return await prisma.user.update({
        where: { id: userId },
        data: { status: "ACTIVE" },
        select: {
            id: true,
            name: true,
            email: true,
            status: true,
        },
    });
};

const deactivateUser = async (userId: string) => {
    return await prisma.user.update({
        where: { id: userId },
        data: { status: "BLOCKED" },
        select: {
            id: true,
            name: true,
            email: true,
            status: true,
        },
    });
};

const deleteUser = async (userId: string) => {
    return await prisma.user.update({
        where: { id: userId },
        data: { status: "DELECTED" },
        select: {
            id: true,
            name: true,
            email: true,
            status: true,
        },
    });
};

export const userService = {
    createUser,
    getAllUsers,
    updateUserRole,
    activateUser,
    deactivateUser,
    deleteUser,
};
