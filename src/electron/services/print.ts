import { BrowserWindow, dialog, ipcMain } from "electron";
import fs from "node:fs";

export function printHandlers() {
    ipcMain.handle(
        "exportPdf",
        async (_, html: string, defaultFilename: string) => {
            const { filePath, canceled } = await dialog.showSaveDialog({
                defaultPath: defaultFilename,
                filters: [{ name: "PDF", extensions: ["pdf"] }],
            });

            if (canceled || !filePath) {
                return { success: false };
            }

            const base64Html = Buffer.from(html, "utf8").toString("base64");
            const win = new BrowserWindow({ show: false });

            await win.loadURL(`data:text/html;base64,${base64Html}`);

            const pdfBuffer = await win.webContents.printToPDF({
                landscape: true,
                printBackground: true,
                margins: {
                    top: 0.4,
                    bottom: 0.4,
                    left: 0.4,
                    right: 0.4,
                },
            });

            win.close();

            fs.writeFileSync(filePath, pdfBuffer);
            return { success: true, filePath };
        },
    );
}
