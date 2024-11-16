import { Router } from "express";
import { addProductToCartController, updateProductQuantityController, clearCartController, getUserCartController, getAllCartsController } from "../controller/cart";

const cartRouter = Router();

cartRouter.post('/add-product', addProductToCartController);
cartRouter.put('/update-quantity', updateProductQuantityController);
cartRouter.delete('/clear-cart/:cartId', clearCartController);
cartRouter.get('/get-cart', getUserCartController);
cartRouter.get("/get-all-carts", getAllCartsController);

export default cartRouter;
