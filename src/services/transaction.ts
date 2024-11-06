import * as transactionRepo from "../repositories/transaction-repo";
import * as cartRepo from "../repositories/cart-repo";
import { TransactionStatus } from "@prisma/client";
import { TransactionDTO, CreateTransactionDTO } from "../types/dto/transaction-dto";
import midTrans from "../libs/midtrans";

export const createTransactionFromCart = async (userId: number, shipTo: string): Promise<TransactionDTO> => {
    const cart = await cartRepo.getCartByUserId(userId);

    if (!cart || !cart.items.length) {
        throw new Error("Cannot create transaction. Cart is empty.");
    }

    const totalAmount = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);

    const transactionData: CreateTransactionDTO = {
        userId,
        cartId: cart.cartId,
        shipTo,
        totalAmount,
        status: TransactionStatus.PENDING,
    };

    const transaction = await transactionRepo.createTransaction(transactionData);

    await cartRepo.clearCart(cart.cartId); // Clear the cart after checkout

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
    const cart = await cartRepo.getCartByUserId(userId);
    if (!cart || !cart.items.length) {
        throw new Error("Cannot create transaction. Cart is empty.");
    }

    const totalAmount = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);

    const transactionData: CreateTransactionDTO = {
        userId,
        cartId: cart.cartId,
        shipTo,
        totalAmount,
        status: TransactionStatus.PENDING,
    };
    const transaction = await transactionRepo.createTransaction(transactionData);

    const paymentPayload = {
        transaction_details: {
            order_id: `ORDER-${transaction.id}`,
            gross_amount: totalAmount,
        },
        customer_details: {
            first_name: "Customer",
            email: "customer@example.com",
        },
    };

    const midtransResponse = await midTrans.createTransaction(paymentPayload);

    await transactionRepo.updateTransactionPayment(transaction.id, {
        paymentMethod: "midtrans",
        paymentUrl: midtransResponse.redirect_url,
    });

    return { transaction, paymentUrl: midtransResponse.redirect_url };
};