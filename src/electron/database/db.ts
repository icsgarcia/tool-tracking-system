import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../../../generated/prisma/client.js";
import { app } from "electron";
import path from "path";
import fs from "fs";
import { isDev } from "../util.js";
import Database from "better-sqlite3";
import QRCode from "qrcode";

let prisma: PrismaClient;

const CREATE_TABLES_SQL = `
CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "qrCode" TEXT NOT NULL,
    "schoolNumber" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "middleName" TEXT,
    "lastName" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'STUDENT',
    "department" TEXT NOT NULL,
    "yearLevel" INTEGER,
    "email" TEXT,
    "number" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE'
);

CREATE UNIQUE INDEX IF NOT EXISTS "User_qrCode_key" ON "User"("qrCode");

CREATE TABLE IF NOT EXISTS "Asset" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "temporaryTagNumber" TEXT UNIQUE,
    "qrCode" TEXT NOT NULL UNIQUE,
    "assetName" TEXT NOT NULL,
    "assetDescription" TEXT,
    "serialNumber" TEXT,
    "assetCategoryCode" TEXT,
    "roomName" TEXT,
    "locationCode" TEXT,
    "assetCount" INTEGER NOT NULL,
    "assetCondition" TEXT,
    "remarks" TEXT
);

CREATE UNIQUE INDEX IF NOT EXISTS "Asset_temporaryTagNumber_key" ON "Asset"("temporaryTagNumber");
CREATE UNIQUE INDEX IF NOT EXISTS "Asset_qrCode_key" ON "Asset"("qrCode");

CREATE TABLE IF NOT EXISTS "Transaction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "borrowCount" INTEGER NOT NULL,
    "returnCount" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'BORROWED',
    "borrowedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "returnedAt" DATETIME,
    CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Transaction_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
`;

export async function initDatabase() {
    let dbPath: string;

    if (isDev()) {
        dbPath = path.join(app.getAppPath(), "prisma", "dev.db");
    } else {
        dbPath = path.join(app.getPath("userData"), "database.db");
    }

    // Ensure directory exists
    const dbDir = path.dirname(dbPath);
    if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
    }

    console.log("[database] Using database at:", dbPath);

    // Create tables if they don't exist
    const db = new Database(dbPath);
    db.exec(CREATE_TABLES_SQL);
    db.close();

    console.log("[database] Tables created/verified.");

    const dbUrl = `file:${dbPath}`;
    const adapter = new PrismaBetterSqlite3({ url: dbUrl });
    prisma = new PrismaClient({ adapter });

    await seedDefaultAdmin();
}

async function seedDefaultAdmin() {
    const existingAdmin = await prisma.user.findFirst({
        where: { role: "ADMIN" },
    });

    if (existingAdmin) {
        console.log("[database] Admin already exists. Skipping seed.");
        return;
    }

    const qrCode = `USER-ADMIN-0001-${Date.now()}`;

    const admin = await prisma.user.create({
        data: {
            qrCode,
            schoolNumber: "ADMIN-0001",
            firstName: "System",
            middleName: "",
            lastName: "Administrator",
            role: "ADMIN",
            department: "BS AMT",
            yearLevel: 0,
            email: "",
            number: "",
            status: "ACTIVE",
        },
    });

    // Save QR code image to Desktop
    const desktopPath = app.getPath("desktop");
    const qrImagePath = path.join(desktopPath, "ADMIN-QR-CODE.png");

    await QRCode.toFile(qrImagePath, qrCode, {
        width: 400,
        margin: 2,
    });

    console.log("[database] Default admin created!");
    console.log("[database] Admin QR Code: ", qrCode);
    console.log("[database] QR Code image saved to:", qrImagePath);
}

export function getPrisma() {
    if (!prisma) {
        throw new Error("Database not initialized. Call initDatabase() first.");
    }
    return prisma;
}

export async function closeDatabase() {
    if (prisma) {
        await prisma.$disconnect();
        console.log("[database] Disconnected.");
    }
}

export { prisma };
