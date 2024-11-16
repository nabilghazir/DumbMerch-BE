import { Request, Response } from 'express';
import * as cartService from "../services/cart";
import { AddProductToCartDTO, UpdateProductQuantityDTO } from '../types/dto/cart-dto';

// Controller to add a product to the cart
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

// Controller to update product quantity in the cart
export const updateProductQuantityController = async (req: Request, res: Response) => {
    try {
        const data: UpdateProductQuantityDTO = req.body;
        data.id = Number(data.id);
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

// Controller to clear the cart
export const clearCartController = async (req: Request, res: Response) => {
    const cartId = Number(req.params.cartId);

    try {
        const updatedCart = await cartService.clearUserCart(cartId);
        res.status(200).json(updatedCart);
    } catch (error) {
        res.status(500).json({ message: "Error clearing cart", error });
    }
};

// Controller to get user cart
export const getUserCartController = async (req: Request, res: Response) => {
    const userId = res.locals.user.id;

    try {
        const cart = await cartService.getUserCart(userId);


        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: "Error fetching cart", error });
    }
};


// Controller to get all carts
export const getAllCartsController = async (req: Request, res: Response) => {
    try {
        const carts = await cartService.getAllCarts();
        res.status(200).json(carts);
    } catch (error) {
        res.status(500).json({ message: "Error fetching carts", error });
    }
};
