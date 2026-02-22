import { app, BrowserWindow } from "electron";
import path from "path";
import { isDev } from "./util.js";
import { closeDatabase, initDatabase } from "./database/db.js";
import { UserHandlers } from "./services/user.js";
import { ToolHandlers } from "./services/tool.js";
import { TransactionHandlers } from "./services/transaction.js";
import { getPreloadPath } from "./pathResolver.js";

app.on("ready", async () => {
    await initDatabase();

    UserHandlers();
    ToolHandlers();
    TransactionHandlers();

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
