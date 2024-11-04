import * as cartRepositories from "../repositories/cart-repo";
import { CreateCartDTO, AddProductToCartDTO, UpdateProductQuantityDTO } from "../types/dto/cart-dto";

export const createCart = async (data: CreateCartDTO) => {
    return await cartRepositories.createCart(data);
};

export const findCartByUserId = async (userId: number) => {
    return await cartRepositories.findCartByUserId(userId);
};

export const addProductToCart = async (data: AddProductToCartDTO) => {
    return await cartRepositories.addProductToCart(data);
};

export const updateProductQuantity = async (data: UpdateProductQuantityDTO) => {
    return await cartRepositories.updateProductQuantity(data);
};

export const calculateTotalPrice = async (cartId: number) => {
    return await cartRepositories.calculateTotalPrice(cartId);
};

export const clearCart = async (cartId: number) => {
    return await cartRepositories.clearCart(cartId);
};
