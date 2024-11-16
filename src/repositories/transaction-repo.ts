import { prisma } from "../libs/prisma";
import { CreateTransactionDTO, TransactionDTO } from "../types/dto/transaction-dto";

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

export const findTransactionByCartId = async (cartId: number): Promise<TransactionDTO | null> => {
    const transaction = await prisma.transactions.findUnique({
        where: { cartId },
    });
    return transaction;
};

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

export const getAllTransactions = async (): Promise<TransactionDTO[]> => {
    return await prisma.transactions.findMany({
        include: {
            cart: true,
            user: true,
            payment: true,
        },
    });
};

export const sumAllTransactionsAmount = async (): Promise<number> => {
    const sum = await prisma.transactions.aggregate({
        _sum: {
            totalAmount: true,
        },
    });

    return sum._sum.totalAmount ?? 0;
}