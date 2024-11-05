// src/repositories/cartRepository.ts
import { prisma } from "../libs/prisma";
import {
    CreateCartDTO,
    AddProductToCartDTO,
    UpdateProductQuantityDTO,
    CartDetailsDTO,
    CartItemDTO,
} from "../types/dto/cart-dto";

export const createCart = async (data: CreateCartDTO, initialProduct?: AddProductToCartDTO): Promise<CartDetailsDTO> => {
    const cart = await prisma.cart.create({
        data: { userId: data.userId },
    });

    if (initialProduct) {
        await addProductToCart({
            userId: cart.userId,
            productId: initialProduct.productId,
            quantity: initialProduct.quantity,
        });
    }

    const cartDetails = await findCartByUserId(cart.userId);

    if (!cartDetails) {
        throw new Error("Failed to create cart");
    }

    return cartDetails;
};

export const findCartByUserId = async (userId: number): Promise<CartDetailsDTO | null> => {
    const cart = await prisma.cart.findFirst({
        where: { userId },
        include: { cartItems: { include: { product: true } } },
    });

    if (!cart) return null;

    const items: CartItemDTO[] = cart.cartItems.map((cartItem) => ({
        productId: cartItem.productId,
        name: cartItem.product.name,
        price: cartItem.product.price,
        quantity: cartItem.quantity ?? 1,
    }));

    return {
        cartId: cart.id,
        userId: cart.userId,
        items,
        totalPrice: cart.totalPrice ?? 0,
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
        where: { cartId_productId: { cartId: data.cartId, productId: data.productId } },
    });

    if (!cartProduct) {
        throw new Error(`Product with ID ${data.productId} not found in cart ${data.cartId}`);
    }

    await prisma.cartProduct.update({
        where: { cartId_productId: { cartId: data.cartId, productId: data.productId } },
        data: { quantity: data.quantity },
    });

    return calculateTotalPrice(data.cartId);
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
    const cart = await prisma.cart.findFirst({
        where: { userId },
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

    if (!cart) return null;

    const items: CartItemDTO[] = cart.cartItems.map((cartItem) => ({
        productId: cartItem.productId,
        name: cartItem.product.name,
        category: cartItem.product.category.name,
        price: cartItem.product.price,
        quantity: cartItem.quantity ?? 1,
        image: cartItem.product.productImages[0]?.url,
    }));

    return {
        cartId: cart.id,
        userId: cart.userId,
        items,
        totalPrice: cart.totalPrice ?? 0,
    };
};
