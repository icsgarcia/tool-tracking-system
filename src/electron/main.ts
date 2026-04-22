import { app, BrowserWindow, Menu, dialog } from "electron";
import path from "path";
import { isDev } from "./util.js";
import { closeDatabase, initDatabase } from "./database/db.js";
import { UserHandlers } from "./services/user.js";
import { AssetHandlers } from "./services/asset.js";
import { TransactionHandlers } from "./services/transaction.js";
import { getPreloadPath } from "./pathResolver.js";
import { checkOverdueTransactions } from "./jobs/transactionStatusJob.js";
import cron from "node-cron";
import { printHandlers } from "./services/print.js";
import { DatabaseHandlers } from "./services/database.js";

let mainWindow: BrowserWindow | null = null;
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
    dialog.showErrorBox(
        "Application Already Running",
        "The application is already running. Please check your taskbar.",
    );
    app.quit();
} else {
    app.on("second-instance", () => {
        if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore();
            mainWindow.focus();

            dialog.showMessageBox(mainWindow, {
                type: "info",
                title: "Application Already Running",
                message: "The application is already running.",
                buttons: ["OK"],
            });
        }
    });

    app.on("ready", async () => {
        // Menu.setApplicationMenu(null);

        await initDatabase();

        UserHandlers();
        AssetHandlers();
        TransactionHandlers();
        printHandlers();
        DatabaseHandlers();

        cron.schedule("0 * * * *", () => {
            checkOverdueTransactions();
        });

        mainWindow = new BrowserWindow({
            webPreferences: {
                preload: getPreloadPath(),
                contextIsolation: true,
                sandbox: false,
            },
        });
        if (isDev()) {
            mainWindow.loadURL("http://localhost:5173");
        } else {
            mainWindow.loadFile(
                path.join(app.getAppPath(), "/dist-react/index.html"),
            );
        }

        mainWindow.on("closed", () => {
            mainWindow = null;
        });
    });

    app.on("window-all-closed", async () => {
        await closeDatabase();
        app.quit();
    });
}
