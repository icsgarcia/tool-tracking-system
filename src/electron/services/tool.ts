import { ipcMain } from "electron";
import { getPrisma } from "../database/db.js";
import QRCode from "qrcode";
import * as XLSX from "xlsx";

export function ToolHandlers() {
    const prisma = getPrisma();

    // Create tools from Excel file (receives file buffer from renderer)
    ipcMain.handle(
        "tool:createToolByFile",
        async (_, fileBuffer: ArrayBuffer) => {
            const workbook = XLSX.read(fileBuffer, { type: "buffer" });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData: CreateToolDto[] =
                XLSX.utils.sheet_to_json(worksheet);

            const createdTools = [];

            for (const row of jsonData) {
                const qrCodeData = `TOOL-${row["name"]}-${Date.now()}`;

                const tool = await prisma.tool.create({
                    data: {
                        qrCode: qrCodeData,
                        name: String(row["name"]),
                        quantity: Number(row["quantity"]),
                    },
                });
                createdTools.push(tool);
            }

            return {
                message: `Successfully created ${createdTools.length} tools`,
                tools: createdTools,
            };
        },
    );

    // Create a single tool
    ipcMain.handle("tool:createTool", async (_, toolData: CreateToolDto) => {
        const qrCodeData = `TOOL-${toolData.name}-${Date.now()}`;

        const tool = await prisma.tool.create({
            data: {
                qrCode: qrCodeData,
                name: toolData.name,
                quantity: toolData.quantity,
            },
        });

        return tool;
    });

    // Get all tools with QR code images
    ipcMain.handle("tool:getAllTools", async () => {
        const tools = await prisma.tool.findMany();

        if (tools.length === 0) {
            return [];
        }

        const toolsWithQrCode = await Promise.all(
            tools.map(async (tool) => {
                const qrCodeBuffer = await QRCode.toBuffer(tool.qrCode);
                const qrCodeBase64 = `data:image/png;base64,${qrCodeBuffer.toString("base64")}`;
                return {
                    ...tool,
                    qrCodeImage: qrCodeBase64,
                };
            }),
        );

        return toolsWithQrCode;
    });

    // Get tool by ID
    ipcMain.handle("tool:getToolById", async (_, toolId: string) => {
        const tool = await prisma.tool.findUnique({
            where: { id: toolId },
        });

        if (!tool) {
            throw new Error("Tool not found");
        }

        return tool;
    });
}
