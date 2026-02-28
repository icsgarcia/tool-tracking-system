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
        "transaction:borrowAsset",
        async (_, userId: string, assetQrCode: string, borrowCount: number) => {
            return await prisma.$transaction(async (tx) => {
                const asset = await tx.asset.findUnique({
                    where: { qrCode: assetQrCode },
                });

                if (!asset) {
                    throw new Error("Asset Not Found");
                }

                if (borrowCount <= 0) {
                    throw new Error("Borrow count must be at least 1");
                }

                const existingBorrow = await tx.transaction.findFirst({
                    where: {
                        userId: userId,
                        assetId: asset.id,
                        status: {
                            in: ["BORROWED", "UNRETURNED"],
                        },
                    },
                });

                if (existingBorrow) {
                    throw new Error(
                        `You already have a borrowed transaction for "${asset.assetName}"`,
                    );
                }

                const totals = await tx.transaction.aggregate({
                    where: {
                        assetId: asset.id,
                        status: {
                            in: ["BORROWED", "UNRETURNED"],
                        },
                    },
                    _sum: {
                        borrowCount: true,
                        returnCount: true,
                    },
                });

                const totalBorrowed = totals._sum.borrowCount ?? 0;
                const totalReturned = totals._sum.returnCount ?? 0;
                const currentlyBorrowed = totalBorrowed - totalReturned;
                const available = asset.assetCount - currentlyBorrowed;

                if (borrowCount > available) {
                    throw new Error(
                        available <= 0
                            ? "No Available Assets To Borrow"
                            : `Only ${available} available, cannot borrow ${borrowCount}`,
                    );
                }

                const transaction = await tx.transaction.create({
                    data: {
                        userId: userId,
                        assetId: asset.id,
                        borrowCount,
                    },
                    include: {
                        user: true,
                        asset: true,
                    },
                });

                return {
                    message: `Successfully borrowed ${borrowCount}x "${asset.assetName}"`,
                    transaction,
                };
            });
        },
    );

    ipcMain.handle(
        "transaction:returnAsset",
        async (_, userId: string, assetQrCode: string, returnCount: number) => {
            return await prisma.$transaction(async (tx) => {
                const asset = await tx.asset.findUnique({
                    where: { qrCode: assetQrCode },
                });

                if (!asset) {
                    throw new Error("Asset Not Found");
                }

                if (returnCount <= 0) {
                    throw new Error("Return count must be at least 1");
                }

                const existingBorrow = await tx.transaction.findFirst({
                    where: {
                        userId: userId,
                        assetId: asset.id,
                        status: {
                            in: ["BORROWED", "UNRETURNED"],
                        },
                    },
                });

                if (!existingBorrow) {
                    throw new Error(
                        `No active borrow found for "${asset.assetName}"`,
                    );
                }

                const alreadyReturned = existingBorrow.returnCount ?? 0;
                const remaining = existingBorrow.borrowCount - alreadyReturned;

                if (returnCount > remaining) {
                    throw new Error(
                        `Cannot return ${returnCount}, only ${remaining} remaining to return`,
                    );
                }

                const isFullReturn = returnCount === remaining;

                const updatedTransaction = await tx.transaction.update({
                    where: { id: existingBorrow.id },
                    data: {
                        returnCount: alreadyReturned + returnCount,
                        status: isFullReturn
                            ? "RETURNED"
                            : existingBorrow.status,
                        returnedAt: isFullReturn ? new Date() : null,
                    },
                    include: {
                        user: true,
                        asset: true,
                    },
                });

                return {
                    message: isFullReturn
                        ? `Successfully returned all "${asset.assetName}"`
                        : `Successfully returned ${returnCount}x "${asset.assetName}" (${remaining - returnCount} remaining)`,
                    transaction: updatedTransaction,
                };
            });
        },
    );

    // ipcMain.handle(
    //     "transaction:scanAssetQrCode",
    //     async (_, userId: string, assetQrCode: string) => {
    //         const asset = await prisma.asset.findUnique({
    //             where: { qrCode: assetQrCode },
    //         });

    //         if (!asset) {
    //             throw new Error("Asset Not Found");
    //         }

    //         const existingBorrow = await prisma.transaction.findFirst({
    //             where: {
    //                 userId: userId,
    //                 assetId: asset.id,
    //                 status: "BORROWED",
    //             },
    //         });

    //         if (existingBorrow) {
    //             // Return the asset
    //             const updatedTransaction = await prisma.transaction.update({
    //                 where: { id: existingBorrow.id },
    //                 data: {
    //                     status: "RETURNED",
    //                     returnedAt: new Date(),
    //                 },
    //                 include: {
    //                     user: true,
    //                     asset: true,
    //                 },
    //             });

    //             return {
    //                 message: `Successfully returned "${asset.assetName}"`,
    //                 transaction: updatedTransaction,
    //             };
    //         } else {
    //             // Borrow the asset
    //             const borrowedCount = await prisma.transaction.count({
    //                 where: {
    //                     assetId: asset.id,
    //                     status: "BORROWED",
    //                 },
    //             });

    //             if (borrowedCount >= asset.assetCount) {
    //                 throw new Error("No Available Assets To Borrow");
    //             }

    //             const transaction = await prisma.transaction.create({
    //                 data: {
    //                     userId: userId,
    //                     assetId: asset.id,
    //                 },
    //                 include: {
    //                     user: true,
    //                     asset: true,
    //                 },
    //             });

    //             return {
    //                 message: `Successfully borrowed "${asset.assetName}"`,
    //                 transaction,
    //             };
    //         }
    //     },
    // );
}
