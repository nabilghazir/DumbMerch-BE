import { prisma } from "../libs/prisma"
import { ProfileUpdateDTO } from "../types/dto/profile-dto"



export const updateProfile = async (id: number, data: ProfileUpdateDTO) => {

    return prisma.profile.update({
        where: {
            id: id
        },
        data: {
            ...data,
            avatar: data?.avatar ? data?.avatar : null
        }
    })
}


export const getProfile = async (id: number) => {
    return prisma.profile.findUnique({
        where: {
            id: id
        }
    })
}