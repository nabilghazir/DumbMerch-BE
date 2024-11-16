import { prisma } from "../libs/prisma";
import {
    CreateCartDTO,
    AddProductToCartDTO,
    UpdateProductQuantityDTO,
    CartDetailsDTO,
    CartItemDTO,
} from "../types/dto/cart-dto";

export const createCart = async (
    data: CreateCartDTO,
    initialProduct?: AddProductToCartDTO
): Promise<CartDetailsDTO> => {
    let cart = await prisma.cart.create({
        data: { userId: data.userId },
    });

    if (!cart) {
        throw new Error('Failed to create cart');
    }

    if (initialProduct) {
        await addProductToCart({
            userId: cart.userId,
            productId: initialProduct.productId,
            quantity: initialProduct.quantity,
        });
    }

    const cartDetails = await findCartByUserId(cart.userId);
    if (!cartDetails) {
        throw new Error('Failed to fetch cart details after creation');
    }

    return {
        id: cart.id,
        userId: cart.userId,
        items: cartDetails.items ?? [],
        totalPrice: cartDetails.totalPrice ?? 0,
    };
};


export const findCartByUserId = async (userId: number): Promise<CartDetailsDTO | null> => {
    const cart = await prisma.cart.findFirst({
        where: { userId },
        include: {
            cartItems: {
                include: {
                    product: {
                        include: {
                            productImages: true
                        }
                    }
                },
                orderBy: {
                    createdAt: 'asc'
                }
            }
        },
    });

    if (!cart) {
        const create = await prisma.cart.create({
            data: { userId },
        })

        if (!create) {
            throw new Error('Failed to create cart');
        }

        return null;
    }

    const items: CartItemDTO[] = cart!.cartItems.map((cartItem) => ({
        productId: cartItem.productId,
        name: cartItem.product.name,
        price: cartItem.product.price,
        stock: cartItem.product.stock,
        image: cartItem.product.productImages[0]?.url,
        quantity: cartItem.quantity ?? 1,
    }));

    return {
        id: cart!.id,
        userId: cart!.userId,
        items,
        totalPrice: cart!.totalPrice ?? 0,
    };
};

export const addProductToCart = async (data: AddProductToCartDTO): Promise<CartDetailsDTO | null> => {
    let cart = await prisma.cart.findFirst({
        where: { userId: data.userId },
    });

    if (!cart) {
        cart = await prisma.cart.create({
            data: { userId: data.userId },
        });
    }

    await prisma.cartProduct.upsert({
        where: { cartId_productId: { cartId: cart.id, productId: data.productId } },
        update: { quantity: { increment: data.quantity } },
        create: {
            cartId: cart.id,
            productId: data.productId,
            quantity: data.quantity,
        },
    });

    return calculateTotalPrice(cart.id);
};

export const updateProductQuantity = async (data: UpdateProductQuantityDTO): Promise<CartDetailsDTO | null> => {
    const cartProduct = await prisma.cartProduct.findUnique({
        where: { cartId_productId: { cartId: data.id, productId: data.productId } },
    });

    if (!cartProduct) {
        throw new Error(`Product with ID ${data.productId} not found in cart ${data.id}`);
    }

    await prisma.cartProduct.update({
        where: { cartId_productId: { cartId: data.id, productId: data.productId } },
        data: { quantity: data.quantity },
    });

    return calculateTotalPrice(data.id);
};

export const calculateTotalPrice = async (cartId: number): Promise<CartDetailsDTO | null> => {
    const cart = await prisma.cart.findUnique({
        where: { id: cartId },
        include: { cartItems: { include: { product: true } } },
    });

    if (!cart) return null;

    const totalPrice = cart.cartItems.reduce((total, cartItem) => {
        return total + cartItem.product.price * (cartItem.quantity ?? 1);
    }, 0);

    await prisma.cart.update({
        where: { id: cartId },
        data: { totalPrice },
    });

    return findCartByUserId(cart.userId);
};

export const clearCart = async (cartId: number): Promise<CartDetailsDTO | null> => {
    await prisma.cartProduct.deleteMany({ where: { cartId } });
    await prisma.cart.update({ where: { id: cartId }, data: { totalPrice: 0 } });

    return findCartByUserId(cartId);
};

export const getCartByUserId = async (userId: number): Promise<CartDetailsDTO | null> => {

    let cart = await prisma.cart.findFirst({
        where: { userId },
        include: {
            cartItems: {
                include: {
                    product: {
                        include: {
                            category: true,
                            productImages: true,
                        },
                    },
                },
            },
        },
    });

    if (!cart) {


        cart = await prisma.cart.create({
            data: { userId },
            include: {
                cartItems: { include: { product: { include: { category: true, productImages: true } } } },
            },
        });

        return {
            id: cart.id,
            userId: cart.userId,
            items: [],
            totalPrice: 0,
        } as CartDetailsDTO;
    }

    const items: CartItemDTO[] = (cart.cartItems ?? []).map((cartItem) => ({
        productId: cartItem.productId,
        name: cartItem.product.name,
        category: cartItem.product.category.name,
        price: cartItem.product.price,
        stock: cartItem.product.stock,
        quantity: cartItem.quantity ?? 1,
        image: cartItem.product.productImages[0]?.url,
    }));

    return {
        id: cart.id,
        userId: cart.userId,
        items,
        totalPrice: cart.totalPrice ?? 0,
    } as CartDetailsDTO;
};

export const getAllCarts = async (): Promise<CartDetailsDTO[]> => {
    const carts = await prisma.cart.findMany({
        include: {
            cartItems: {
                include: {
                    product: {
                        include: {
                            category: true,
                            productImages: true
                        }
                    }
                },
            },
        },
    });

    return carts.map((cart) => ({
        id: cart.id,
        userId: cart.userId,
        items: cart.cartItems.map((cartItem) => ({
            productId: cartItem.productId,
            name: cartItem.product.name,
            category: cartItem.product.category.name,
            price: cartItem.product.price,
            stock: cartItem.product.stock,
            quantity: cartItem.quantity ?? 1,
            image: cartItem.product.productImages[0]?.url,
        })),
        totalPrice: cart.totalPrice ?? 0,
    }));
};
