import { ipcMain } from "electron";
import { getPrisma } from "../database/db.js";

export function TransactionHandlers() {
    const prisma = getPrisma();

    ipcMain.handle("transaction:getTotalTransactions", async () => {
        const [totalTransactions, totalPendingTransactions] = await Promise.all(
            [
                prisma.transaction.count(),
                prisma.transaction.count({
                    where: {
                        status: {
                            in: ["BORROWED", "UNRETURNED"],
                        },
                    },
                }),
            ],
        );

        return { totalTransactions, totalPendingTransactions };
    });

    ipcMain.handle(
        "transaction:getAllTransactions",
        async (_, params: PaginationParams) => {
            const { page, pageSize, search, sortBy, sortOrder } = params;
            let orderBy;
            if (sortBy === "userName") {
                orderBy = { user: { lastName: sortOrder || "asc" } };
            } else if (sortBy === "assetName") {
                orderBy = { asset: { assetName: sortOrder || "asc" } };
            } else if (sortBy === "borrowedAt") {
                orderBy = { borrowedAt: sortOrder || "asc" };
            } else if (sortBy) {
                orderBy = { [sortBy]: sortOrder || "asc" };
            }

            const where = search
                ? {
                      OR: [
                          { id: { contains: search } },
                          { user: { firstName: { contains: search } } },
                          { user: { middleName: { contains: search } } },
                          { user: { lastName: { contains: search } } },
                          { asset: { assetName: { contains: search } } },
                      ],
                  }
                : undefined;

            const [transactions, totalCount] = await Promise.all([
                prisma.transaction.findMany({
                    where,
                    include: {
                        asset: true,
                        user: true,
                    },
                    orderBy,
                    skip: page * pageSize,
                    take: pageSize,
                }),
                prisma.transaction.count({ where }),
            ]);
            return { data: transactions, totalCount };
        },
    );

    ipcMain.handle(
        "transaction:getUserTransactions",
        async (_, userId: string, params: PaginationParams) => {
            const { page, pageSize, search, sortBy, sortOrder } = params;

            let orderBy;
            if (sortBy === "assetName") {
                orderBy = { asset: { assetName: sortOrder || "asc" } };
            } else if (sortBy === "borrowedQuantity") {
                orderBy = { borrowCount: sortOrder || "asc" };
            } else if (sortBy === "returnedQuantity") {
                orderBy = { returnCount: sortOrder || "asc" };
            } else if (sortBy === "borrowedDate") {
                orderBy = { borrowedAt: sortOrder || "asc" };
            } else if (sortBy === "returnedDate") {
                orderBy = { returnedAt: sortOrder || "asc" };
            } else if (sortBy) {
                orderBy = { [sortBy]: sortOrder || "asc" };
            }

            const where = search
                ? {
                      OR: [
                          { id: { contains: search } },
                          { asset: { assetName: { contains: search } } },
                      ],
                  }
                : undefined;

            const [userTransactions, totalCount] = await Promise.all([
                prisma.transaction.findMany({
                    where: {
                        userId,
                        ...where,
                    },
                    include: {
                        asset: true,
                    },
                    orderBy,
                    skip: page * pageSize,
                    take: pageSize,
                }),
                prisma.transaction.count({
                    where: {
                        userId,
                        ...where,
                    },
                }),
            ]);

            return { data: userTransactions, totalCount };
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
}
