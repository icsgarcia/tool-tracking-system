import { app, BrowserWindow, Menu } from "electron";
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

app.on("ready", async () => {
    // Menu.setApplicationMenu(null);

    await initDatabase();

    UserHandlers();
    AssetHandlers();
    TransactionHandlers();
    printHandlers();

    cron.schedule("0 * * * *", () => {
        checkOverdueTransactions();
    });

    const mainWindow = new BrowserWindow({
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
});

app.on("window-all-closed", async () => {
    await closeDatabase();
    app.quit();
});
