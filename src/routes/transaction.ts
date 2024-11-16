import { Router } from "express";
import * as transactionController from "../controller/transaction";
import { authorization } from "../middlewares/authorization";


const transactionRouter = Router();

transactionRouter.post("/create", transactionController.createTransactionController);

transactionRouter.get("/user/all", transactionController.getAllTransactionsForUserController);

transactionRouter.get("/get", authorization("ADMIN"), transactionController.getAllTransactions);

transactionRouter.get("/get/amount", authorization("ADMIN"), transactionController.getTransactionsAmount);

transactionRouter.get("/get/find/:cartId", transactionController.getTransactionByCartIdController);

transactionRouter.get("/get/:transactionId", transactionController.getTransactionByIdController);

export default transactionRouter;
