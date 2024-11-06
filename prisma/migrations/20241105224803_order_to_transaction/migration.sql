/*
  Warnings:

  - You are about to drop the column `OrderId` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the `Order` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[TransactionId]` on the table `Payment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `TransactionId` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('PENDING', 'INPROGRESS', 'COMPLETED', 'CANCELED');

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_cartId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_userId_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_OrderId_fkey";

-- DropIndex
DROP INDEX "Payment_OrderId_key";

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "OrderId",
ADD COLUMN     "TransactionId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Order";

-- DropEnum
DROP TYPE "OrderStatus";

-- CreateTable
CREATE TABLE "Transactions" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "shipTo" TEXT,
    "cartId" INTEGER NOT NULL,
    "totalAmount" INTEGER NOT NULL,
    "status" "TransactionStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Transactions_cartId_key" ON "Transactions"("cartId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_TransactionId_key" ON "Payment"("TransactionId");

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "Cart"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_TransactionId_fkey" FOREIGN KEY ("TransactionId") REFERENCES "Transactions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
