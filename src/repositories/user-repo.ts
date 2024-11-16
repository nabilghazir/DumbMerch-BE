import { RegisterDTO } from "../types/dto/auth-dto";
import { prisma } from "../libs/prisma";
import { Role } from "@prisma/client";


export const checkUser = async (email: string) => {
    return prisma.user.findFirst({
        where: {
            email: email,
        }
    })
}

export const createUser = async (user: RegisterDTO) => {
    return prisma.user.create({
        data: {
            email: user.email,
            password: user.password,
            profile: {
                create: {
                    name: user.name
                }
            }
        }
    })
}

export const findUserAndProfile = async (email: string) => {
    return prisma.user.findFirst({
        where: {
            email
        },
        select: {
            id: true,
            email: true,
            role: true,
            profile: true
        }
    })
}

export const getAllUser = async () => {
    return prisma.user.findMany({
        select: {
            id: true,
            email: true,
            role: true,
            profile: true
        }
    })
}

export const getAdmin = async () => {
    return prisma.user.findFirst({
        where: {
            role: Role.ADMIN
        }
    })
}