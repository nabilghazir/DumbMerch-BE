import { prisma } from "../libs/prisma";
import { CreateCartDTO, AddProductToCartDTO, UpdateProductQuantityDTO, CartDetailsDTO, CartItemDTO } from "../types/dto/cart-dto";


export const createCart = async (data: CreateCartDTO): Promise<CartDetailsDTO> => {
    const cart = await prisma.cart.create({
        data: { userId: data.userId }
    });

    return {
        cartId: cart.id,
        userId: cart.userId,
        items: [],
        totalPrice: cart.totalPrice ?? 0,
    };
};

export const findCartByUserId = async (userId: number): Promise<CartDetailsDTO | null> => {
    const cart = await prisma.cart.findFirst({
        where: {
            userId: userId
        },
        include: {
            cartItems: {
                include: { product: true }
            }
        }
    });

    if (!cart) return null;

    const items: CartItemDTO[] = cart.cartItems.map(cartItem => ({
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
    await prisma.cartProduct.upsert({
        where: {
            cartId_productId: { cartId: data.cartId, productId: data.productId },
        },
        update: {
            quantity: { increment: data.quantity },
        },
        create: {
            cartId: data.cartId,
            productId: data.productId,
            quantity: data.quantity,
        }
    });

    return findCartByUserId(data.cartId);
};

export const updateProductQuantity = async (data: UpdateProductQuantityDTO): Promise<CartDetailsDTO | null> => {
    await prisma.cartProduct.update({
        where: {
            cartId_productId: { cartId: data.cartId, productId: data.productId },
        },
        data: { quantity: data.quantity },
    });

    return findCartByUserId(data.cartId);
};

export const calculateTotalPrice = async (cartId: number): Promise<CartDetailsDTO | null> => {
    const cart = await prisma.cart.findUnique({
        where: { id: cartId },
        include: {
            cartItems: {
                include: { product: true },
            },
        },
    });

    if (!cart) return null;

    const totalPrice = cart.cartItems.reduce((total, cartItem) => {
        return total + cartItem.product.price * (cartItem.quantity ?? 1);
    }, 0);

    await prisma.cart.update({
        where: { id: cartId },
        data: { totalPrice },
    });

    return findCartByUserId(cartId);
};

export const clearCart = async (cartId: number): Promise<CartDetailsDTO | null> => {
    await prisma.cartProduct.deleteMany({
        where: { cartId },
    });

    await prisma.cart.update({
        where: { id: cartId },
        data: { totalPrice: 0 },
    });

    return findCartByUserId(cartId);
};
