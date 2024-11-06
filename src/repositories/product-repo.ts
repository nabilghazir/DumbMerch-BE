import { prisma } from "../libs/prisma";
import { ProductByCategoryDTO, ProductDTO } from "../types/dto/product-dto";

export const getAllProduct = async () => {
    return prisma.product.findMany({
        include: {
            category: true,
            productImages: true,
        },
    });
};

export const getProduct = async (id: number) => {
    return prisma.product.findUnique({
        where: {
            id,
        },
        include: {
            productImages: true,
        },
    });
};

export const getProductByCategory = async (categoryId: number) => {
    return prisma.product.findMany({
        where: {
            categoryId,
        },
    });
};

export const findProductByCategoryAndName = async (data: ProductByCategoryDTO) => {
    return await prisma.product.findFirst({
        where: {
            name: data.productName,
            category: {
                name: data.categoryName,
            },
        },
        include: {
            category: true,
            productImages: true,
        },
    });
};

export const findProductByName = async (productName: string) => {
    return await prisma.product.findFirst({
        where: {
            name: productName,
        },
        include: {
            category: true,
            productImages: true,
        },
    });
};



export const createProduct = async (productData: ProductDTO) => {

    const category = await prisma.category.findFirst({
        where: { name: productData.categoryName },
    });

    let categoryId;

    if (!category) {
        const newCategory = await prisma.category.create({
            data: { name: productData.categoryName },
        });
        categoryId = newCategory.id;
    } else {
        categoryId = category.id;
    }

    return prisma.product.create({
        data: {
            name: productData.name,
            desc: productData.desc,
            price: productData.price,
            stock: productData.stock,
            category: {
                connect: { id: categoryId }, // Connect to the category by ID
            },
            productImages: {
                create: Array.isArray(productData.productImages) ? productData.productImages.map(image => ({ url: image.url })) : [], // Ensure it's an array
            },
        },
    });
};



export const updateProduct = async (id: number, product: ProductDTO) => {
    return prisma.product.update({
        where: { id },
        data: {
            name: product.name,
            desc: product.desc,
            price: product.price,
            stock: product.stock,
            productImages: {
                deleteMany: {},
                create: product.productImages?.map((image) => ({
                    url: image.url,
                })),
            },
        },
    });
};

export const deleteProduct = async (id: number) => {
    await prisma.cartProduct.deleteMany({
        where: {
            productId: id,
        },
    });

    return prisma.product.delete({
        where: {
            id,
        },
    });
};

