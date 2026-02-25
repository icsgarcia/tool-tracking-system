import { BrowserWindow, ipcMain } from "electron";

export function printHandlers() {
    const printOptions: Electron.WebContentsPrintOptions = {
        silent: false,
        printBackground: true,
        color: true,
        margins: {
            marginType: "printableArea",
        },
        landscape: true,
        pagesPerSheet: 1,
        collate: false,
        copies: 1,
        header: "Page header",
        footer: "Page footer",
    };

    ipcMain.handle("print", async (_, html) => {
        const base64Html = Buffer.from(html, "utf8").toString("base64");
        const url = `data:text/html;base64,${base64Html}`;

        let win = new BrowserWindow({ show: false });

        return new Promise((resolve, reject) => {
            win.webContents.once("did-finish-load", () => {
                win.webContents.print(
                    printOptions,
                    (success, failureReason) => {
                        if (!success) {
                            console.log(failureReason);
                            reject(failureReason);
                        } else {
                            resolve("shown print dialog");
                        }
                        win.close();
                    },
                );
            });

            win.loadURL(url);
        });
    });
}
