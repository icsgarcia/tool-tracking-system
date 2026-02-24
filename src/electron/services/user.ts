import { ipcMain } from "electron";
import { getPrisma } from "../database/db.js";
import QRCode from "qrcode";
import * as XLSX from "xlsx";
import { Role } from "../../../generated/prisma/enums.js";
import { User } from "../../../generated/prisma/client.js";

export function UserHandlers() {
    const prisma = getPrisma();

    // Create users from Excel file (receives file buffer from renderer)
    ipcMain.handle(
        "user:createUserByFile",
        async (_, fileBuffer: ArrayBuffer) => {
            const workbook = XLSX.read(fileBuffer, { type: "buffer" });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData: CreateUserDto[] =
                XLSX.utils.sheet_to_json(worksheet);

            const createdUsers = [];

            for (const row of jsonData) {
                const qrCodeData = `USER-${row["schoolNumber"]}-${Date.now()}`;

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
                        email: String(row["email"]),
                        number: row["number"] ? String(row["number"]) : null,
                    },
                });
                createdUsers.push(user);
            }

            return {
                message: `Successfully created ${createdUsers.length} users`,
                users: createdUsers,
            };
        },
    );

    // Create a single user
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

    // Get all users with QR code images
    ipcMain.handle("user:getAllUsers", async () => {
        const users = await prisma.user.findMany();

        if (users.length === 0) {
            return [];
        }

        const usersWithQrCode = await Promise.all(
            users.map(async (user) => {
                const qrCodeBuffer = await QRCode.toBuffer(user.qrCode);
                const qrCodeBase64 = `data:image/png;base64,${qrCodeBuffer.toString("base64")}`;
                return {
                    ...user,
                    qrCodeImage: qrCodeBase64,
                };
            }),
        );

        return usersWithQrCode;
    });

    // Get user by ID
    ipcMain.handle("user:getUserById", async (_, userId: string) => {
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new Error("User not found");
        }

        return user;
    });

    // Get user QR code data URL
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

    // Get user QR code as base64 buffer (for download/print)
    ipcMain.handle("user:getUserQRCodeBuffer", async (_, userId: string) => {
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new Error("User not found");
        }

        const qrCodeBuffer = await QRCode.toBuffer(user.qrCode);
        return `data:image/png;base64,${qrCodeBuffer.toString("base64")}`;
    });

    // Find user by QR code (for scanning/login)
    ipcMain.handle("user:getUserByQRCode", async (_, qrCode: string) => {
        const user = await prisma.user.findFirst({
            where: { qrCode },
        });

        if (!user) {
            throw new Error("User not found with this QR Code");
        }

        return user;
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

    ipcMain.handle("user:deleteAllUsers", async (_, userId: string) => {
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
