import { prisma } from "../libs/prisma";

export const createCategory = async (name: string) => {
    return prisma.category.create({
        data: {
            name
        }
    })
}

export const getCategory = async (id: number) => {
    return prisma.category.findUnique({
        where: {
            id
        }
    })
}


export const findCategoryByName = async (categoryName: string) => {
    return await prisma.category.findFirst({
        where: {
            name: categoryName,
        },
        include: {
            products: {
                include: {
                    productImages: true
                }
            }
        },
    });
};

export const getAllCategory = async () => {
    return prisma.category.findMany()
}

export const updateCategory = async (id: number, name: string) => {
    return prisma.category.update({
        where: {
            id
        },
        data: {
            name
        }
    })
}

export const deleteCategory = async (id: number) => {
    return prisma.category.delete({
        where: {
            id
        }
    })
}