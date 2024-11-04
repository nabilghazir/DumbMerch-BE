import express from "express";
import * as cartControllers from "../controller/cart";

const cartRouter = express.Router();

cartRouter.post("/", cartControllers.createCart);
cartRouter.get("/:userId", cartControllers.findCartByUserId);
cartRouter.post("/add-product", cartControllers.addProductToCart);
cartRouter.put("/update-product", cartControllers.updateProductQuantity);
cartRouter.put("/calculate-total/:cartId", cartControllers.calculateTotalPrice);
cartRouter.delete("/:cartId", cartControllers.clearCart);

export default cartRouter;
