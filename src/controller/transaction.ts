import { Request, Response } from 'express';
import * as transactionService from "../services/transaction";

export const createTransactionController = async (req: Request, res: Response): Promise<void> => {
    const userId = res.locals.user.id;
    console.log("User ID Create Transaction :", userId);

    const { shipTo } = req.body;
    try {

        const { transaction, paymentUrl } = await transactionService.createTransactionWithPayment(userId, shipTo);
        res.status(201).json({ transaction, paymentUrl });
    } catch (error) {
        console.error("Transaction creation error:", error); // Log error details to the console
        res.status(500).json({ message: "Error creating transaction", error: error instanceof Error ? error.message : error });
    }
};


export const getTransactionByIdController = async (req: Request, res: Response): Promise<void> => {
    const transactionId = Number(req.params.transactionId);

    try {
        const transaction = await transactionService.getTransactionById(transactionId);
        if (!transaction) {
            res.status(404).json({ message: "Transaction not found" });
            return;
        }
        res.status(200).json(transaction);
    } catch (error) {
        res.status(500).json({ message: "Error fetching transaction", error });
    }
};

export const getAllTransactionsForUserController = async (req: Request, res: Response): Promise<void> => {
    const userId = res.locals.user.id;

    try {
        const transactions = await transactionService.getAllTransactionsForUser(userId);
        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ message: "Error fetching transactions", error });
    }
};

export const getTransactionByCartIdController = async (req: Request, res: Response): Promise<void> => {
    const cartId = Number(req.params.cartId);

    try {
        const transaction = await transactionService.getTransactionByCartId(cartId);
        if (!transaction) {
            res.status(404).json({ message: "Transaction not found" });
            return;
        }
        res.status(200).json(transaction);
    } catch (error) {
        res.status(500).json({ message: "Error fetching transaction", error });
    }
}

export const getAllTransactions = async (req: Request, res: Response): Promise<void> => {
    try {
        const transactions = await transactionService.getTransactions();

        res.status(200).json(transactions);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error fetching transactions' });
    }
};

export const getTransactionsAmount = async (req: Request, res: Response): Promise<void> => {
    try {
        const amount = await transactionService.getTransactionsAmount();
        res.status(200).json({ amount });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error fetching transactions amount' });
    }
};