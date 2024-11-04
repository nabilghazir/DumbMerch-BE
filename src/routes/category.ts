import { Router } from "express";
import * as categoryController from "../controller/category"
import { authorization } from "../middlewares/authorization";

const categoryRouter = Router();


categoryRouter.get(
    "/getallcategory",
    categoryController.getAllCategory)

categoryRouter.get(
    "/:categoryName",
    categoryController.fetchCategory
)

categoryRouter.post(
    "/create",
    authorization("ADMIN"),
    categoryController.createCategory)


categoryRouter.delete(
    "/delete/:id",
    authorization("ADMIN"),
    categoryController.deleteCategory)

categoryRouter.put(
    "/update/:id",
    authorization("ADMIN"),
    categoryController.updateCategory)

export default categoryRouter
