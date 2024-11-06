import { prisma } from "../libs/prisma";
import { CreateTransactionDTO, TransactionDTO } from "../types/dto/transaction-dto";



// Create a new transaction
export const createTransaction = async (data: CreateTransactionDTO): Promise<TransactionDTO> => {
    return await prisma.transactions.create({
        data: {
            userId: data.userId,
            cartId: data.cartId,
            shipTo: data.shipTo,
            totalAmount: data.totalAmount,
            status: data.status,
        },
        include: {
            cart: {
                include: {
                    cartItems: {
                        include: {
                            product: true,
                        },
                    },
                },
            },
        },
    });
};

// Fetch a transaction by ID
export const findTransactionById = async (transactionId: number): Promise<TransactionDTO | null> => {
    return await prisma.transactions.findUnique({
        where: { id: transactionId },
        include: {
            payment: true,
            cart: {
                include: {
                    cartItems: {
                        include: {
                            product: {
                                include: { productImages: true },
                            },
                        },
                    },
                },
            },
        },
    });
};

// Fetch all transactions for a user
export const findAllTransactionsForUser = async (userId: number): Promise<TransactionDTO[]> => {
    return await prisma.transactions.findMany({
        where: { userId },
        include: {
            cart: {
                include: {
                    cartItems: {
                        include: {
                            product: {
                                include: { productImages: true },
                            },
                        },
                    },
                },
            },
        },
    });
};

export const updateTransactionPayment = async (transactionId: number, paymentData: { paymentMethod: string; paymentUrl: string }) => {
    return await prisma.transactions.update({
        where: { id: transactionId },
        data: {
            payment: {
                create: {
                    paymentMethod: paymentData.paymentMethod,
                    paymentUrl: paymentData.paymentUrl,
                    paymentStatus: "PENDING",
                },
            },
        },
    });
};