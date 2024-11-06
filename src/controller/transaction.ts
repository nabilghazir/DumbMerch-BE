import { Request, Response } from 'express';
import * as transactionService from "../services/transaction";

export const createTransactionController = async (req: Request, res: Response) => {
    const userId = res.locals.user.id;
    const { shipTo } = req.body;

    try {
        const { transaction, paymentUrl } = await transactionService.createTransactionWithPayment(userId, shipTo);
        res.status(201).json({ transaction, paymentUrl });
    } catch (error) {
        res.status(500).json({ message: "Error creating transaction", error });
    }
};

export const getTransactionByIdController = async (req: Request, res: Response) => {
    const transactionId = Number(req.params.transactionId);

    try {
        const transaction = await transactionService.getTransactionById(transactionId);
        if (!transaction) {
            res.status(404).json({ message: "Transaction not found" });
        }
        res.status(200).json(transaction);
    } catch (error) {
        res.status(500).json({ message: "Error fetching transaction", error });
    }
};

export const getAllTransactionsForUserController = async (req: Request, res: Response) => {
    const userId = res.locals.user.id;

    try {
        const transactions = await transactionService.getAllTransactionsForUser(userId);
        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ message: "Error fetching transactions", error });
    }
};
