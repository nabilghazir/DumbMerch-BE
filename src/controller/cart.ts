import { Request, Response } from 'express';
import * as cartService from "../services/cart";
import { AddProductToCartDTO, UpdateProductQuantityDTO } from '../types/dto/cart-dto';

export const addProductToCartController = async (req: Request, res: Response) => {
    const userId = res.locals.user.id;
    const { productId, quantity } = req.body;

    const productData: AddProductToCartDTO = {
        userId,
        productId: Number(productId),
        quantity: Number(quantity),
    };

    try {
        const cart = await cartService.addProductToCart(productData);
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Error adding product to cart', error });
    }
};


export const updateProductQuantityController = async (req: Request, res: Response) => {
    try {
        const data: UpdateProductQuantityDTO = req.body;

        data.cartId = Number(data.cartId);
        data.productId = Number(data.productId);
        data.quantity = Number(data.quantity);

        const cart = await cartService.updateProductQuantity(data);
        res.status(200).json(cart);
    } catch (error) {
        if (error instanceof Error && error.message.includes("not found in cart")) {
            res.status(404).json({ message: error.message });
        } else {
            res.status(500).json({ message: "Error updating product quantity", error });
        }
    }
};


export const clearCartController = async (req: Request, res: Response) => {
    const { cartId } = req.params;

    try {
        const cart = await cartService.clearUserCart(Number(cartId));
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Error clearing cart', error });
    }
};

export const getUserCartController = async (req: Request, res: Response) => {
    try {
        const userId = res.locals.user.id

        const cart = await cartService.getUserCart(userId);
        if (cart) {
            res.status(200).json(cart);
        } else {
            res.status(404).json({ message: "Cart not found" });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving cart', error });
    }
};