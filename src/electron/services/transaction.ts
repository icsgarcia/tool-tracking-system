import { ipcMain } from "electron";
import { getPrisma } from "../database/db.js";
import * as XLSX from "xlsx";
import * as fs from "fs";
import { dialog } from "electron";

export function TransactionHandlers() {
    const prisma = getPrisma();

    // HELPER FUNCTIONS
    const getColumnWidths = (data: any[]) => {
        if (data.length === 0) return [];
        const headers = Object.keys(data[0]);
        return headers.map((header) => {
            const maxLength = Math.max(
                header.length,
                ...data.map((row) => {
                    const value = row[header];
                    return value ? String(value).length : 0;
                }),
            );
            return { wch: maxLength + 2 };
        });
    };

    // MAIN FUNCTIONS
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
        "transaction:getTransactions",
        async (_, params: PaginationParams) => {
            const { page, pageSize, search, sortBy, sortOrder, range } = params;

            let dateFilter = {};

            if (range) {
                const now = new Date();
                let startDate: Date;
                let endDate: Date;

                switch (range) {
                    case "today":
                        startDate = new Date(now);
                        startDate.setHours(0, 0, 0, 0);

                        endDate = new Date(startDate);
                        endDate.setDate(endDate.getDate() + 1);
                        break;
                    case "week":
                        startDate = new Date(now);
                        startDate.setHours(0, 0, 0, 0);
                        startDate.setDate(now.getDate() - now.getDay());

                        endDate = new Date(startDate);
                        endDate.setDate(endDate.getDate() + 7);
                        break;
                    case "month":
                        startDate = new Date(
                            now.getFullYear(),
                            now.getMonth(),
                            1,
                        );

                        endDate = new Date(
                            now.getFullYear(),
                            now.getMonth() + 1,
                            1,
                        );
                        break;

                    default:
                        throw new Error(`Invalid range: ${range}`);
                }

                dateFilter = { borrowedAt: { gte: startDate, lt: endDate } };
            }

            const searchFilter = search
                ? {
                      OR: [
                          { id: { contains: search } },
                          { user: { firstName: { contains: search } } },
                          { user: { middleName: { contains: search } } },
                          { user: { lastName: { contains: search } } },
                          { asset: { assetName: { contains: search } } },
                      ],
                  }
                : {};

            const where = {
                ...dateFilter,
                ...searchFilter,
            };

            let orderBy;

            if (sortBy === "userName") {
                orderBy = { user: { lastName: sortOrder || "asc" } };
            } else if (sortBy === "assetName") {
                orderBy = { asset: { assetName: sortOrder || "asc" } };
                // } else if (sortBy === "borrowedAt") {
                //     orderBy = { borrowedAt: sortOrder || "asc" };
            } else if (sortBy) {
                orderBy = { [sortBy]: sortOrder || "asc" };
            }

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
            const { page, pageSize, search, sortBy, sortOrder, range } = params;

            let dateFilter = {};

            if (range) {
                const now = new Date();
                let startDate: Date;
                let endDate: Date;

                switch (range) {
                    case "today":
                        startDate = new Date(now);
                        startDate.setHours(0, 0, 0, 0);

                        endDate = new Date(startDate);
                        endDate.setDate(endDate.getDate() + 1);
                        break;
                    case "week":
                        startDate = new Date(now);
                        startDate.setHours(0, 0, 0, 0);
                        startDate.setDate(now.getDate() - now.getDay());

                        endDate = new Date(startDate);
                        endDate.setDate(endDate.getDate() + 7);
                        break;
                    case "month":
                        startDate = new Date(
                            now.getFullYear(),
                            now.getMonth(),
                            1,
                        );

                        endDate = new Date(
                            now.getFullYear(),
                            now.getMonth() + 1,
                            1,
                        );
                        break;

                    default:
                        throw new Error(`Invalid range: ${range}`);
                }

                dateFilter = { borrowedAt: { gte: startDate, lt: endDate } };
            }

            const searchFilter = search
                ? {
                      OR: [
                          { id: { contains: search } },
                          { asset: { assetName: { contains: search } } },
                      ],
                  }
                : {};

            const where = {
                userId,
                ...dateFilter,
                ...searchFilter,
            };

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

            const [userTransactions, totalCount] = await Promise.all([
                prisma.transaction.findMany({
                    where,
                    include: {
                        asset: true,
                    },
                    orderBy,
                    skip: page * pageSize,
                    take: pageSize,
                }),
                prisma.transaction.count({
                    where,
                }),
            ]);

            return { data: userTransactions, totalCount };
        },
    );

    ipcMain.handle("transaction:exportAllTransactions", async () => {
        return prisma.transaction.findMany({
            include: { user: true, asset: true },
            orderBy: { borrowedAt: "desc" },
        });
    });

    ipcMain.handle(
        "transaction:exportTransactionWithSpreadsheet",
        async (_, params: Omit<PaginationParams, "page" | "pageSize">) => {
            const { search, sortBy, sortOrder, range } = params;

            let dateFilter = {};

            if (range) {
                const now = new Date();
                let startDate: Date;
                let endDate: Date;

                switch (range) {
                    case "today":
                        startDate = new Date(now);
                        startDate.setHours(0, 0, 0, 0);
                        endDate = new Date(startDate);
                        endDate.setDate(endDate.getDate() + 1);
                        break;
                    case "week":
                        startDate = new Date(now);
                        startDate.setHours(0, 0, 0, 0);
                        startDate.setDate(now.getDate() - now.getDay());
                        endDate = new Date(startDate);
                        endDate.setDate(endDate.getDate() + 7);
                        break;
                    case "month":
                        startDate = new Date(
                            now.getFullYear(),
                            now.getMonth(),
                            1,
                        );
                        endDate = new Date(
                            now.getFullYear(),
                            now.getMonth() + 1,
                            1,
                        );
                        break;
                    default:
                        throw new Error(`Invalid range: ${range}`);
                }
                dateFilter = { borrowedAt: { gte: startDate, lt: endDate } };
            }

            const searchFilter = search
                ? {
                      OR: [
                          { id: { contains: search } },
                          { user: { firstName: { contains: search } } },
                          { user: { middleName: { contains: search } } },
                          { user: { lastName: { contains: search } } },
                          { asset: { assetName: { contains: search } } },
                      ],
                  }
                : null;

            const where =
                searchFilter && range
                    ? { AND: [searchFilter, dateFilter] }
                    : (searchFilter ?? dateFilter ?? {});

            let orderBy: any = { borrowedAt: "desc" };
            if (sortBy === "userName")
                orderBy = { user: { lastName: sortOrder || "asc" } };
            else if (sortBy === "assetName")
                orderBy = { asset: { assetName: sortOrder || "asc" } };
            else if (sortBy) orderBy = { [sortBy]: sortOrder || "asc" };

            const transactions = await prisma.transaction.findMany({
                where,
                include: { asset: true, user: true },
                orderBy,
            });

            const formatted = transactions.map((transaction) => ({
                ID: transaction.id,
                Borrower: `${transaction.user.firstName} ${transaction.user.middleName} ${transaction.user.lastName}`,
                "Borrowed Asset": transaction.asset.assetName,
                "Borrowed At": new Date(transaction.borrowedAt).toLocaleString(
                    "en-US",
                    {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                    },
                ),
                "Returned At": transaction.returnedAt
                    ? new Date(transaction.returnedAt).toLocaleString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                      })
                    : "-",
                Status: transaction.status,
            }));

            const rangeLabel = range ?? "All";
            const { filePath, canceled } = await dialog.showSaveDialog({
                title: "Export Transactions",
                defaultPath: `transactions_${rangeLabel}_${Date.now()}.xlsx`,
                filters: [{ name: "Excel File", extensions: ["xlsx"] }],
            });

            if (canceled || !filePath) return { success: false };

            const worksheet = XLSX.utils.json_to_sheet(formatted);
            const workbook = XLSX.utils.book_new();

            worksheet["!cols"] = getColumnWidths(formatted);

            XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");

            const buffer = XLSX.write(workbook, {
                type: "buffer",
                bookType: "xlsx",
            });
            fs.writeFileSync(filePath, buffer);

            return { success: true, filePath };
        },
    );

    ipcMain.handle(
        "transaction:exportUserTransactionWithSpreadsheet",
        async (
            _,
            userId: string,
            params: Omit<PaginationParams, "page" | "pageSize">,
        ) => {
            const { search, sortBy, sortOrder, range } = params;

            let dateFilter = {};

            if (range) {
                const now = new Date();
                let startDate: Date;
                let endDate: Date;

                switch (range) {
                    case "today":
                        startDate = new Date(now);
                        startDate.setHours(0, 0, 0, 0);
                        endDate = new Date(startDate);
                        endDate.setDate(endDate.getDate() + 1);
                        break;
                    case "week":
                        startDate = new Date(now);
                        startDate.setHours(0, 0, 0, 0);
                        startDate.setDate(now.getDate() - now.getDay());
                        endDate = new Date(startDate);
                        endDate.setDate(endDate.getDate() + 7);
                        break;
                    case "month":
                        startDate = new Date(
                            now.getFullYear(),
                            now.getMonth(),
                            1,
                        );
                        endDate = new Date(
                            now.getFullYear(),
                            now.getMonth() + 1,
                            1,
                        );
                        break;
                    default:
                        throw new Error(`Invalid range: ${range}`);
                }
                dateFilter = { borrowedAt: { gte: startDate, lt: endDate } };
            }

            const searchFilter = search
                ? {
                      OR: [
                          { id: { contains: search } },
                          { user: { firstName: { contains: search } } },
                          { user: { middleName: { contains: search } } },
                          { user: { lastName: { contains: search } } },
                          { asset: { assetName: { contains: search } } },
                      ],
                  }
                : null;

            const userIdFilter = { userId };

            const where =
                searchFilter && range
                    ? { AND: [userIdFilter, searchFilter, dateFilter] }
                    : (searchFilter ?? dateFilter ?? {});

            let orderBy: any = { borrowedAt: "desc" };
            if (sortBy === "userName")
                orderBy = { user: { lastName: sortOrder || "asc" } };
            else if (sortBy === "assetName")
                orderBy = { asset: { assetName: sortOrder || "asc" } };
            else if (sortBy) orderBy = { [sortBy]: sortOrder || "asc" };

            const transactions = await prisma.transaction.findMany({
                where,
                include: { asset: true },
                orderBy,
            });

            const formatted = transactions.map((transaction) => ({
                ID: transaction.id,
                "Borrowed Asset": transaction.asset.assetName,
                "Borrowed Quantity": transaction.borrowCount,
                "Returned Quantity": transaction.returnCount ?? 0,
                "Borrowed At": new Date(transaction.borrowedAt).toLocaleString(
                    "en-US",
                    {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                    },
                ),
                "Returned At": transaction.returnedAt
                    ? new Date(transaction.returnedAt).toLocaleString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                      })
                    : "-",
                Status: transaction.status,
            }));

            const rangeLabel = range ?? "All";
            const { filePath, canceled } = await dialog.showSaveDialog({
                title: "Export Transactions",
                defaultPath: `user_transactions_${rangeLabel}_${Date.now()}.xlsx`,
                filters: [{ name: "Excel File", extensions: ["xlsx"] }],
            });

            if (canceled || !filePath) return { success: false };

            const worksheet = XLSX.utils.json_to_sheet(formatted);
            const workbook = XLSX.utils.book_new();

            worksheet["!cols"] = getColumnWidths(formatted);

            XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");

            const buffer = XLSX.write(workbook, {
                type: "buffer",
                bookType: "xlsx",
            });
            fs.writeFileSync(filePath, buffer);

            return { success: true, filePath };
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
                    throw new Error("Tool Not Found");
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
                            ? "No Available tools To Borrow"
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
        async (
            _,
            userId: string,
            assetQrCode: string,
            returnCount: number,
            remarks: string,
        ) => {
            return await prisma.$transaction(async (tx) => {
                const asset = await tx.asset.findUnique({
                    where: { qrCode: assetQrCode },
                });

                if (!asset) {
                    throw new Error("Tool Not Found");
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

                await tx.asset.update({
                    where: { id: asset.id },
                    data: { remarks },
                });

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
