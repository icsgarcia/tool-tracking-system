import { ipcMain } from "electron";
import { getPrisma } from "../database/db.js";

export function TransactionHandlers() {
    const prisma = getPrisma();

    ipcMain.handle("transaction:getAllTransactions", async () => {
        const transactions = await prisma.transaction.findMany({
            include: {
                tool: true,
                user: true,
            },
            orderBy: {
                borrowedAt: "desc",
            },
        });
        return transactions;
    });

    ipcMain.handle(
        "transaction:getUserTransactions",
        async (_, userId: string) => {
            const userTransactions = await prisma.transaction.findMany({
                where: {
                    userId,
                },
                include: {
                    tool: true,
                },
                orderBy: {
                    borrowedAt: "desc",
                },
            });

            return userTransactions;
        },
    );

    ipcMain.handle(
        "transaction:scanToolQrCode",
        async (_, userId: string, toolQrCode: string) => {
            const tool = await prisma.tool.findUnique({
                where: { qrCode: toolQrCode },
            });

            if (!tool) {
                throw new Error("Tool Not Found");
            }

            const existingBorrow = await prisma.transaction.findFirst({
                where: {
                    userId: userId,
                    toolId: tool.id,
                    status: "BORROWED",
                },
            });

            if (existingBorrow) {
                // Return the tool
                const updatedTransaction = await prisma.transaction.update({
                    where: { id: existingBorrow.id },
                    data: {
                        status: "RETURNED",
                        returnedAt: new Date(),
                    },
                    include: {
                        user: true,
                        tool: true,
                    },
                });

                return {
                    message: `Successfully returned "${tool.name}"`,
                    transaction: updatedTransaction,
                };
            } else {
                // Borrow the tool
                const borrowedCount = await prisma.transaction.count({
                    where: {
                        toolId: tool.id,
                        status: "BORROWED",
                    },
                });

                if (borrowedCount >= tool.quantity) {
                    throw new Error("No Available Tools To Borrow");
                }

                const transaction = await prisma.transaction.create({
                    data: {
                        userId: userId,
                        toolId: tool.id,
                    },
                    include: {
                        user: true,
                        tool: true,
                    },
                });

                return {
                    message: `Successfully borrowed "${tool.name}"`,
                    transaction,
                };
            }
        },
    );
}
