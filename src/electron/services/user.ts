import { ipcMain } from "electron";
import { getPrisma } from "../database/db.js";
import QRCode from "qrcode";
import * as XLSX from "xlsx";
import { Role } from "../../../generated/prisma/enums.js";
import { User } from "../../../generated/prisma/client.js";
import { randomUUID } from "node:crypto";
import bcrypt from "bcryptjs";
import * as fs from "fs";
import { dialog } from "electron";
import ExcelJS from "exceljs";

export function UserHandlers() {
    const prisma = getPrisma();

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

    const getFormattedDate = () => {
        const now = new Date();
        const formattedDate =
            `${now.getMonth() + 1}-` +
            `${now.getDate()}-` +
            `${now.getFullYear()}_` +
            `${now.getHours()}-` +
            `${now.getMinutes()}-` +
            `${now.getSeconds()}`;

        return formattedDate;
    };

    ipcMain.handle("user:manualLogin", async (_, loginData: LoginData) => {
        const { email, password } = loginData;

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            throw new Error("Email or Password is incorrect");
        }

        const correctPassword = bcrypt.compareSync(password, user.password);

        if (!correctPassword) {
            throw new Error("Email or Password is incorrect");
        }

        const { password: _password, ...safeUser } = user;

        return safeUser;
    });

    ipcMain.handle("user:getStudentAndStaff", async () => {
        try {
            const studentsAndStaff = await prisma.user.findMany({
                where: {
                    role: {
                        in: ["STUDENT", "STAFF"],
                    },
                },
            });

            const formatted = studentsAndStaff.map((user) => ({
                value: user.schoolNumber,
                label: `${user.firstName} ${user.middleName} ${user.lastName}`.trim(),
            }));

            return formatted;
        } catch (error) {
            console.error(error);
            throw new Error("Failed to fetch students and staff");
        }
    });

    ipcMain.handle(
        "user:loginBySchoolNumber",
        async (_, schoolNumber: string) => {
            const user = await prisma.user.findUnique({
                where: { schoolNumber },
            });

            if (!user) throw new Error("User not found.");

            const { password: _password, ...safeUser } = user;
            return safeUser;
        },
    );

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
                const salt = bcrypt.genSaltSync(10);
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
                            password: bcrypt.hashSync("Password123!", salt),
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
        const salt = bcrypt.genSaltSync(10);

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
                password: bcrypt.hashSync("Password123!", salt),
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
        const salt = bcrypt.genSaltSync(10);
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
                password: bcrypt.hashSync(userData.password, salt),
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

    ipcMain.handle(
        "users:exportUsersWithSpreadsheet",
        async (_, params: Omit<PaginationParams, "page" | "pageSize">) => {
            const { search, sortBy, sortOrder } = params;

            const sortField = sortBy === "name" ? "lastName" : sortBy;

            const where = search
                ? {
                      OR: [
                          { firstName: { contains: search } },
                          { middleName: { contains: search } },
                          { lastName: { contains: search } },
                          { schoolNumber: { contains: search } },
                          { email: { contains: search } },
                      ],
                  }
                : undefined;

            const users = await prisma.user.findMany({
                where,
                orderBy: sortField
                    ? { [sortField]: sortOrder || "asc" }
                    : undefined,
            });

            if (users.length === 0) {
                return { success: false, error: "No users found to export." };
            }

            const { filePath, canceled } = await dialog.showSaveDialog({
                title: "Export Users",
                defaultPath: `users_${getFormattedDate()}.xlsx`,
                filters: [{ name: "Excel File", extensions: ["xlsx"] }],
            });

            if (canceled || !filePath) return { success: false };

            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet("Users");

            worksheet.columns = [
                { header: "QR Code", key: "qrCode", width: 22 },
                { header: "ID", key: "id", width: 30 },
                { header: "School Number", key: "schoolNumber", width: 18 },
                { header: "First Name", key: "firstName", width: 18 },
                { header: "Middle Name", key: "middleName", width: 18 },
                { header: "Last Name", key: "lastName", width: 18 },
                { header: "Role", key: "role", width: 12 },
                { header: "Department", key: "department", width: 20 },
                { header: "Year Level", key: "yearLevel", width: 12 },
                { header: "Email", key: "email", width: 25 },
                { header: "Number", key: "number", width: 15 },
                { header: "Status", key: "status", width: 12 },
            ];

            worksheet.getRow(1).eachCell((cell) => {
                cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
                cell.fill = {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: { argb: "FF4F81BD" },
                };
                cell.alignment = { horizontal: "center", vertical: "middle" };
                cell.border = {
                    top: { style: "thin" },
                    bottom: { style: "thin" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                };
            });

            worksheet.getColumn(1).width = 25;
            const imageRowHeight = 150;

            for (let i = 0; i < users.length; i++) {
                const user = users[i];
                const rowIndex = i + 2;

                const row = worksheet.addRow({
                    qrCode: "",
                    id: user.id,
                    schoolNumber: user.schoolNumber,
                    firstName: user.firstName,
                    middleName: user.middleName ?? "—",
                    lastName: user.lastName,
                    role: user.role,
                    department: user.department ?? "—",
                    yearLevel: user.yearLevel ?? "—",
                    email: user.email ?? "—",
                    number: user.number ?? "—",
                    status: user.status,
                });

                row.height = imageRowHeight;

                row.eachCell((cell) => {
                    cell.alignment = {
                        vertical: "middle",
                        horizontal: "center",
                    };
                });

                const qrCodeBuffer = await QRCode.toBuffer(user.qrCode, {
                    width: 200,
                    margin: 2,
                });

                const qrCodeBase64 = `data:image/png;base64,${qrCodeBuffer.toString("base64")}`;

                const imageId = workbook.addImage({
                    base64: qrCodeBase64,
                    extension: "png",
                });

                worksheet.addImage(imageId, {
                    tl: { col: 0, row: rowIndex - 1 },
                    // br: { col: 0.9, row: rowIndex - 0.1 },
                    ext: { width: 140, height: 140 },
                    editAs: "oneCell",
                } as any);
            }

            const buffer = await workbook.xlsx.writeBuffer();
            fs.writeFileSync(filePath, Buffer.from(buffer));

            return { success: true, filePath };
        },
    );
}
