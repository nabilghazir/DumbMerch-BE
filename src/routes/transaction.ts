import { Router } from "express";
import * as transactionController from "../controller/transaction";
import { authorization } from "../middlewares/authorization";

const transactionRouter = Router();

transactionRouter.post("/create", transactionController.createTransactionController);

transactionRouter.get("/:transactionId", transactionController.getTransactionByIdController);

transactionRouter.get("/user/all", transactionController.getAllTransactionsForUserController);

export default transactionRouter;
