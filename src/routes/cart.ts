// src/routes/cartRoutes.ts
import express from 'express';
import { addProductToCartController, updateProductQuantityController, clearCartController, getUserCartController } from "../controller/cart";

const cartRouter = express.Router();

cartRouter.post('/add-product', addProductToCartController);
cartRouter.put('/update-quantity', updateProductQuantityController);
cartRouter.delete('/clear-cart/:cartId', clearCartController);
cartRouter.get('/get-cart', getUserCartController);

export default cartRouter;
