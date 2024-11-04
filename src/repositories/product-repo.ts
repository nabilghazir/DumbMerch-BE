import { prisma } from "../libs/prisma";
import { ProductByCategoryDTO, ProductDTO } from "../types/dto/product-dto";

export const getAllProduct = async () => {
    return prisma.product.findMany(
        {
            include: {
                category: true,
                productImages: true
            }
        }
    )
}

export const getProduct = async (id: number) => {
    return prisma.product.findUnique({
        where: {
            id
        },
        include: {
            productImages: true
        }
    })
}

export const getProductByCategory = async (categoryId: number) => {
    return prisma.product.findMany({
        where: {
            categoryId
        }
    })
}

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
            name: productName
        },
        include: {
            category: true,
            productImages: true
        }
    })
}

// productService.ts

// productService.ts

export const createProduct = async (product: ProductDTO) => {
    const { categoryId, category, id, ...productData } = product;

    let categoryID = categoryId;
    if (!categoryID && category?.name) {
        const existingCategory = await prisma.category.findFirst({
            where: { name: category.name },
        });

        if (!existingCategory) {
            throw new Error("Category not found");
        }

        categoryID = existingCategory.id;
    }

    const sanitizedProductData: Omit<ProductDTO, 'id' | 'category' | 'categoryId'> = {
        name: productData.name,
        desc: productData.desc,
        stock: productData.stock,
        price: productData.price,
        productImages: productData.productImages,
    };

    return prisma.product.create({
        data: {
            ...sanitizedProductData,
            category: {
                connect: {
                    id: categoryID,
                },
            },
            productImages: {
                createMany: {
                    data: sanitizedProductData.productImages?.map((image) => ({
                        url: image.url,
                    })) || [],
                },
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
            categoryId: product.categoryId,
            productImages: {
                deleteMany: {},
                create: product.productImages?.map(image => ({
                    url: image.url
                }))
            }
        }
    })
}


export const deleteProduct = async (id: number) => {
    return prisma.product.delete({
        where: {
            id
        }
    })
}