import { ipcMain } from "electron";
import { getPrisma } from "../database/db.js";
import QRCode from "qrcode";
import * as XLSX from "xlsx";
import { Role } from "../../../generated/prisma/enums.js";
import { User } from "../../../generated/prisma/client.js";
import { randomUUID } from "node:crypto";

export function UserHandlers() {
    const prisma = getPrisma();

    ipcMain.handle(
        "user:createUserByFile",
        async (_, fileBuffer: ArrayBuffer) => {
            try {
                const buffer = Buffer.from(fileBuffer);
                const workbook = XLSX.read(buffer, { type: "buffer" });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const jsonData: CreateUserDto[] = XLSX.utils.sheet_to_json(
                    worksheet,
                    {
                        range: 1,
                        header: [
                            "schoolNumber",
                            "lastName",
                            "firstName",
                            "middleName",
                            "department",
                            "yearLevel",
                            "email",
                            "number",
                        ],
                    },
                );

                const createdUsers = [];

                for (const row of jsonData) {
                    const qrCodeData = `USER-${row["schoolNumber"]}-${randomUUID()}`;

                    const user = await prisma.user.create({
                        data: {
                            qrCode: qrCodeData,
                            schoolNumber: String(row["schoolNumber"]),
                            firstName: String(row["firstName"]),
                            middleName: String(row["middleName"] || ""),
                            lastName: String(row["lastName"]),
                            role: row["role"] as Role,
                            department: String(row["department"]),
                            yearLevel: Number(row["yearLevel"]),
                            email: row["email"] ? String(row["email"]) : null,
                            number: row["number"]
                                ? String(row["number"])
                                : null,
                        },
                    });
                    createdUsers.push(user);
                }

                return {
                    message: `Successfully created ${createdUsers.length} users`,
                    users: createdUsers,
                };
            } catch (error) {
                console.error(error);
                throw new Error(
                    error instanceof Error
                        ? error.message
                        : "Failed to import Excel file",
                );
            }
        },
    );

    ipcMain.handle("user:createUser", async (_, userData: CreateUserDto) => {
        const qrCodeData = `USER-${userData.schoolNumber}-${Date.now()}`;

        const user = await prisma.user.create({
            data: {
                qrCode: qrCodeData,
                schoolNumber: userData.schoolNumber,
                firstName: userData.firstName,
                middleName: userData.middleName,
                lastName: userData.lastName,
                role: userData.role as Role,
                department: userData.department,
                yearLevel: userData.yearLevel,
                email: userData.email,
                number: userData.number ?? null,
            },
        });

        return user;
    });

    ipcMain.handle("user:getTotalUsers", async () => {
        const [totalUsers, totalActiveUsers] = await Promise.all([
            prisma.user.count(),
            prisma.user.count({ where: { status: "ACTIVE" } }),
        ]);

        return { totalUsers, totalActiveUsers };
    });

    ipcMain.handle("user:getAllUsers", async (_, params: PaginationParams) => {
        const { page, pageSize, search, sortBy, sortOrder } = params;
        const sortField = sortBy === "name" ? "lastName" : sortBy;

        const where = search
            ? {
                  OR: [
                      { firstName: { contains: search } },
                      { middleName: { contains: search } },
                      { lastName: { contains: search } },
                      {
                          schoolNumber: {
                              contains: search,
                          },
                      },
                      { email: { contains: search } },
                  ],
              }
            : undefined;

        const [users, totalCount] = await Promise.all([
            prisma.user.findMany({
                where,
                orderBy: sortField
                    ? { [sortField]: sortOrder || "asc" }
                    : undefined,
                skip: page * pageSize,
                take: pageSize,
            }),
            prisma.user.count({ where }),
        ]);

        if (users.length === 0) {
            return { data: [], totalCount: 0 };
        }

        const usersWithQrCode = await Promise.all(
            users.map(async (user) => {
                const qrCodeBuffer = await QRCode.toBuffer(user.qrCode, {
                    width: 500,
                    margin: 2,
                });
                const qrCodeBase64 = `data:image/png;base64,${qrCodeBuffer.toString("base64")}`;
                return {
                    ...user,
                    qrCodeImage: qrCodeBase64,
                };
            }),
        );

        return { data: usersWithQrCode, totalCount };
    });

    ipcMain.handle("user:getUserById", async (_, userId: string) => {
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new Error("User not found");
        }

        return user;
    });

    ipcMain.handle("user:getUserQRCode", async (_, userId: string) => {
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new Error("User not found");
        }

        const qrCodeDataUrl = await QRCode.toDataURL(user.qrCode);

        return {
            user: {
                id: user.id,
                fullName: `${user.firstName} ${user.middleName} ${user.lastName}`,
                schoolNumber: user.schoolNumber,
                role: user.role,
            },
            qrCode: qrCodeDataUrl,
        };
    });

    ipcMain.handle("user:getUserQRCodeBuffer", async (_, userId: string) => {
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new Error("User not found");
        }

        const qrCodeBuffer = await QRCode.toBuffer(user.qrCode, {
            width: 500,
            margin: 2,
        });
        return `data:image/png;base64,${qrCodeBuffer.toString("base64")}`;
    });

    ipcMain.handle("user:getUserByQRCode", async (_, qrCode: string) => {
        const user = await prisma.user.findFirst({
            where: { qrCode },
        });

        if (!user) {
            throw new Error("User not found with this QR Code");
        }

        const qrCodeBuffer = await QRCode.toBuffer(user.qrCode, {
            width: 500,
            margin: 2,
        });
        const qrCodeBase64 = `data:image/png;base64,${qrCodeBuffer.toString("base64")}`;

        return {
            ...user,
            qrCodeImage: qrCodeBase64,
        };
    });

    ipcMain.handle("user:updateUserById", async (_, userData: User) => {
        const user = await prisma.user.findUnique({
            where: {
                id: userData.id,
            },
        });

        if (!user) {
            throw new Error("User not found");
        }

        const qrCodeData = `USER-${userData.schoolNumber}-${Date.now()}`;

        const updatedUser = await prisma.user.update({
            where: {
                id: userData.id,
            },
            data: {
                qrCode: qrCodeData,
                schoolNumber: userData.schoolNumber,
                firstName: userData.firstName,
                middleName: userData.middleName,
                lastName: userData.lastName,
                role: userData.role,
                department: userData.department,
                yearLevel: userData.yearLevel,
                email: userData.email,
                number: userData.number || null,
            },
        });

        return {
            message: `User "${updatedUser.firstName} ${updatedUser.lastName}" updated successfully.`,
            user: updatedUser,
        };
    });

    ipcMain.handle("user:deleteUserById", async (_, userId: string) => {
        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        });

        if (!user) {
            throw new Error("User not found");
        }

        await prisma.user.delete({
            where: {
                id: userId,
            },
        });

        return {
            message: `User "${user.firstName} ${user.lastName}" deleted successfully.`,
        };
    });

    ipcMain.handle("user:exportAllUsers", async () => {
        const users = await prisma.user.findMany({
            orderBy: { lastName: "asc" },
        });

        return await Promise.all(
            users.map(async (user) => {
                const qrCodeBuffer = await QRCode.toBuffer(user.qrCode, {
                    width: 500,
                    margin: 2,
                });
                const qrCodeBase64 = `data:image/png;base64,${qrCodeBuffer.toString("base64")}`;
                return {
                    ...user,
                    qrCodeImage: qrCodeBase64,
                };
            }),
        );
    });

    ipcMain.handle("user:deleteAllUsers", async (_, userId: string) => {
        await prisma.transaction.deleteMany({
            where: {
                userId: {
                    not: userId,
                },
            },
        });

        await prisma.user.deleteMany({
            where: {
                NOT: {
                    id: userId,
                },
            },
        });

        return {
            message: "All users except the logged in user have been deleted.",
        };
    });
}
