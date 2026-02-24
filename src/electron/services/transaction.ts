import { ipcMain } from "electron";
import { getPrisma } from "../database/db.js";

export function TransactionHandlers() {
    const prisma = getPrisma();

    ipcMain.handle("transaction:getAllTransactions", async () => {
        const transactions = await prisma.transaction.findMany({
            include: {
                asset: true,
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
                    asset: true,
                },
                orderBy: {
                    borrowedAt: "desc",
                },
            });

            return userTransactions;
        },
    );

    ipcMain.handle(
        "transaction:scanAssetQrCode",
        async (_, userId: string, assetQrCode: string) => {
            const asset = await prisma.asset.findUnique({
                where: { qrCode: assetQrCode },
            });

            if (!asset) {
                throw new Error("Asset Not Found");
            }

            const existingBorrow = await prisma.transaction.findFirst({
                where: {
                    userId: userId,
                    assetId: asset.id,
                    status: "BORROWED",
                },
            });

            if (existingBorrow) {
                // Return the asset
                const updatedTransaction = await prisma.transaction.update({
                    where: { id: existingBorrow.id },
                    data: {
                        status: "RETURNED",
                        returnedAt: new Date(),
                    },
                    include: {
                        user: true,
                        asset: true,
                    },
                });

                return {
                    message: `Successfully returned "${asset.assetName}"`,
                    transaction: updatedTransaction,
                };
            } else {
                // Borrow the asset
                const borrowedCount = await prisma.transaction.count({
                    where: {
                        assetId: asset.id,
                        status: "BORROWED",
                    },
                });

                if (borrowedCount >= asset.assetCount) {
                    throw new Error("No Available Assets To Borrow");
                }

                const transaction = await prisma.transaction.create({
                    data: {
                        userId: userId,
                        assetId: asset.id,
                    },
                    include: {
                        user: true,
                        asset: true,
                    },
                });

                return {
                    message: `Successfully borrowed "${asset.assetName}"`,
                    transaction,
                };
            }
        },
    );
}
