import { app, dialog, ipcMain } from "electron";
import fs from "node:fs";
import path from "path";
import { isDev } from "../util.js";
import { closeDatabase, initDatabase } from "../database/db.js";

function getDatabasePath(): string {
    if (isDev()) {
        return path.join(app.getAppPath(), "prisma", "dev.db");
    }
    return path.join(app.getPath("userData"), "database.db");
}

export function DatabaseHandlers() {
    ipcMain.handle("database:backup", async () => {
        const dbPath = getDatabasePath();

        if (!fs.existsSync(dbPath)) {
            return { success: false, error: "Database file not found." };
        }

        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
        const defaultName = `tool-keeper-backup-${timestamp}.db`;

        const { filePath, canceled } = await dialog.showSaveDialog({
            title: "Save Database Backup",
            defaultPath: defaultName,
            filters: [{ name: "SQLite Database", extensions: ["db"] }],
        });

        if (canceled || !filePath) {
            return { success: false, error: "Backup cancelled." };
        }

        try {
            fs.copyFileSync(dbPath, filePath);
            return { success: true, filePath };
        } catch (err) {
            const message =
                err instanceof Error ? err.message : "Unknown error";
            return { success: false, error: message };
        }
    });

    ipcMain.handle("database:restore", async () => {
        const { filePaths, canceled } = await dialog.showOpenDialog({
            title: "Select Database Backup to Restore",
            filters: [{ name: "SQLite Database", extensions: ["db"] }],
            properties: ["openFile"],
        });

        if (canceled || filePaths.length === 0) {
            return { success: false, error: "Restore cancelled." };
        }

        const backupFile = filePaths[0];
        const dbPath = getDatabasePath();

        try {
            await closeDatabase();
            fs.copyFileSync(backupFile, dbPath);
            await initDatabase();
            return { success: true };
        } catch (err) {
            const message =
                err instanceof Error ? err.message : "Unknown error";
            return { success: false, error: message };
        }
    });
}
