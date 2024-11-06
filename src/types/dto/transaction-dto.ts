import { PaymentStatus, TransactionStatus } from "@prisma/client";

export interface TransactionDTO {
    id: number;
    userId: number;
    cartId: number;
    shipTo?: string | null;
    totalAmount: number;
    status: TransactionStatus;
    payment?: PaymentDTO | null;
}

export interface CreateTransactionDTO {
    userId: number;
    cartId: number;
    shipTo?: string | null;
    totalAmount: number;
    status: TransactionStatus;
}

export interface PaymentDTO {
    id: number;
    paymentMethod: string;
    paymentUrl: string;
    paymentStatus: PaymentStatus;
}