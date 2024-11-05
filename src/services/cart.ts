
import * as cartRepository from "../repositories/cart-repo";
import { CreateCartDTO, AddProductToCartDTO, UpdateProductQuantityDTO, CartDetailsDTO } from "../types/dto/cart-dto";

export const addProductToCart = async (data: AddProductToCartDTO): Promise<CartDetailsDTO> => {
    const cartDetails = await cartRepository.addProductToCart(data);

    if (!cartDetails) {
        throw new Error('Failed to add product to cart');
    }

    return cartDetails;
};


export const updateProductQuantity = async (data: UpdateProductQuantityDTO): Promise<CartDetailsDTO | null> => {
    return cartRepository.updateProductQuantity(data);
};

export const clearUserCart = async (cartId: number): Promise<CartDetailsDTO | null> => {
    return cartRepository.clearCart(cartId);
};

export const getUserCart = async (userId: number): Promise<CartDetailsDTO | null> => {
    return cartRepository.getCartByUserId(userId);
};