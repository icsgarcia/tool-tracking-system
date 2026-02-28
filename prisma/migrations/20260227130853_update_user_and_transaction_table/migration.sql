/*
  Warnings:

  - Added the required column `quantity` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Transaction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'BORROWED',
    "borrowedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "returnedAt" DATETIME,
    CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Transaction_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Transaction" ("assetId", "borrowedAt", "id", "returnedAt", "status", "userId") SELECT "assetId", "borrowedAt", "id", "returnedAt", "status", "userId" FROM "Transaction";
DROP TABLE "Transaction";
ALTER TABLE "new_Transaction" RENAME TO "Transaction";
CREATE TABLE "new_User" (
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
INSERT INTO "new_User" ("department", "email", "firstName", "id", "lastName", "middleName", "number", "qrCode", "role", "schoolNumber", "status", "yearLevel") SELECT "department", "email", "firstName", "id", "lastName", "middleName", "number", "qrCode", "role", "schoolNumber", "status", "yearLevel" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_qrCode_key" ON "User"("qrCode");
CREATE UNIQUE INDEX "User_schoolNumber_key" ON "User"("schoolNumber");
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
