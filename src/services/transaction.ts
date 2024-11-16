// src/services/transaction-service.ts
import * as transactionRepo from "../repositories/transaction-repo";
import * as cartRepo from "../repositories/cart-repo";
import { TransactionStatus } from "@prisma/client";
import { TransactionDTO, CreateTransactionDTO } from "../types/dto/transaction-dto";
import midTrans from "../libs/midtrans";

// Service to create a new transaction from the cart
export const createTransactionFromCart = async (userId: number, shipTo: string): Promise<TransactionDTO> => {
    const cart = await cartRepo.getCartByUserId(userId);

    if (!cart || !cart.items.length) {
        throw new Error("Cannot create transaction. Cart is empty.");
    }

    // Check if a transaction already exists for this cart
    const existingTransaction = await transactionRepo.findTransactionByCartId(cart.id);
    console.log("Existing transaction for cart ID", cart.id, ":", existingTransaction);

    if (existingTransaction) {
        // Return the existing transaction if found
        throw new Error("Transaction already exists for this cart. Complete or cancel the existing transaction.");
    }

    const totalAmount = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);

    const transactionData: CreateTransactionDTO = {
        userId,
        cartId: cart.id,
        shipTo,
        totalAmount,
        status: TransactionStatus.PENDING,
    };

    const transaction = await transactionRepo.createTransaction(transactionData);

    await cartRepo.clearCart(cart.id); // Clear the cart after checkout

    return transaction;
};



// Service to get a transaction by ID
export const getTransactionById = async (transactionId: number): Promise<TransactionDTO | null> => {
    return await transactionRepo.findTransactionById(transactionId);
};

// Service to get all transactions for a user
export const getAllTransactionsForUser = async (userId: number): Promise<TransactionDTO[]> => {
    return await transactionRepo.findAllTransactionsForUser(userId);
};

export const createTransactionWithPayment = async (userId: number, shipTo: string) => {
    // Get the user cart and calculate the total
    const cart = await cartRepo.getCartByUserId(userId);
    if (!cart || !cart.items.length) {
        throw new Error("Cannot create transaction. Cart is empty.");
    }

    // Check if a transaction already exists for this cart
    const existingTransaction = await transactionRepo.findTransactionByCartId(cart.id);
    if (existingTransaction) {
        // If a transaction exists, return it
        return { transaction: existingTransaction, paymentUrl: existingTransaction.payment?.paymentUrl };
    }

    const totalAmount = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);

    // Create a new transaction in the database
    const transactionData: CreateTransactionDTO = {
        userId,
        cartId: cart.id,
        shipTo,
        totalAmount,
        status: TransactionStatus.PENDING,
    };
    const transaction = await transactionRepo.createTransaction(transactionData);

    // Midtrans payment request
    const paymentPayload = {
        transaction_details: {
            order_id: `ORDER-${transaction.id}`,
            gross_amount: totalAmount,
        },
        customer_details: {
            first_name: "Customer",
            email: "customer@example.com", // Ideally fetch this from the user's profile
        },
    };

    // Call Midtrans API to create the transaction
    const midtransResponse = await midTrans.createTransaction(paymentPayload);

    // Update the transaction with payment info
    await transactionRepo.updateTransactionPayment(transaction.id, {
        paymentMethod: "midtrans",
        paymentUrl: midtransResponse.redirect_url,
    });

    // Clear the cart after checkout
    await cartRepo.clearCart(cart.id);

    return { transaction, paymentUrl: midtransResponse.redirect_url };
};

export const getTransactionByCartId = async (cartId: number): Promise<TransactionDTO | null> => {
    return await transactionRepo.findTransactionByCartId(cartId);
};

export const getTransactions = async (): Promise<TransactionDTO[]> => {
    return await transactionRepo.getAllTransactions();

};

export const getTransactionsAmount = async (): Promise<number> => {
    return await transactionRepo.sumAllTransactionsAmount();
}