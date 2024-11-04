import { Request, Response } from "express";
import * as cartServices from "../services/cart";
import { CreateCartDTO, AddProductToCartDTO, UpdateProductQuantityDTO } from "../types/dto/cart-dto";

export const createCart = async (req: Request, res: Response) => {
    try {
        const data: CreateCartDTO = req.body;
        const newCart = await cartServices.createCart(data);

        res.json(newCart);
    } catch (error) {
        console.log(error)
        const err = error as Error
        res.status(500).json({ message: err.message })
    }
};

export const findCartByUserId = async (req: Request, res: Response) => {
    try {
        const userId = Number(req.params.userId);
        const cart = await cartServices.findCartByUserId(userId);

        if (!cart) {
            res.status(404).json({ message: "Cart not found." });
        }

        res.json(cart);
    } catch (error) {
        console.log(error)
        const err = error as Error
        res.status(500).json({ message: err.message })
    }
};

export const addProductToCart = async (req: Request, res: Response) => {
    try {
        const data: AddProductToCartDTO = req.body;
        const updatedCart = await cartServices.addProductToCart(data);

        res.json(updatedCart);
    } catch (error) {
        console.log(error)
        const err = error as Error
        res.status(500).json({ message: err.message })
    }
};

export const updateProductQuantity = async (req: Request, res: Response) => {
    try {
        const data: UpdateProductQuantityDTO = req.body;
        const updatedCart = await cartServices.updateProductQuantity(data);

        res.json(updatedCart);
    } catch (error) {
        console.log(error)
        const err = error as Error
        res.status(500).json({ message: err.message })
    }
};

export const calculateTotalPrice = async (req: Request, res: Response) => {
    try {
        const cartId = Number(req.params.cartId);
        const totalPrice = await cartServices.calculateTotalPrice(cartId);

        res.json(totalPrice);
    } catch (error) {
        console.log(error)
        const err = error as Error
        res.status(500).json({ message: err.message })
    }
};

export const clearCart = async (req: Request, res: Response) => {
    try {
        const cartId = Number(req.params.cartId);
        const updatedCart = await cartServices.clearCart(cartId);
        res.json(updatedCart);
    } catch (error) {
        console.log(error)
        const err = error as Error
        res.status(500).json({ message: err.message })
    }
};
