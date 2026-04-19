import { ipcMain } from "electron";
import { getPrisma } from "../database/db.js";
import QRCode from "qrcode";
import * as XLSX from "xlsx";
import { Asset } from "../../../generated/prisma/client.js";
import { randomUUID } from "crypto";
import * as fs from "fs";
import { dialog } from "electron";
import ExcelJS from "exceljs";

export function AssetHandlers() {
    const prisma = getPrisma();

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

    ipcMain.handle(
        "asset:createAssetByFile",
        async (_, fileBuffer: ArrayBuffer) => {
            try {
                const buffer = Buffer.from(fileBuffer);
                const workbook = XLSX.read(buffer, { type: "buffer" });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const jsonData: CreateAssetDto[] = XLSX.utils.sheet_to_json(
                    worksheet,
                    {
                        range: 15,
                        header: [
                            "temporaryTagNumber",
                            "assetName",
                            "assetDescription",
                            "serialNumber",
                            "assetCategoryCode",
                            "roomName",
                            "locationCode",
                            "assetCount",
                            "assetCondition",
                            "remarks",
                        ],
                    },
                );

                const createdAssets = [];

                for (const row of jsonData) {
                    const qrCodeData = `TOOL-${row["temporaryTagNumber"]}-${randomUUID()}`;

                    const asset = await prisma.asset.create({
                        data: {
                            qrCode: qrCodeData,
                            temporaryTagNumber: String(
                                row["temporaryTagNumber"],
                            ),
                            assetName: String(row["assetName"]),
                            assetDescription: String(row["assetDescription"]),
                            serialNumber: String(row["serialNumber"]),
                            assetCategoryCode: String(row["assetCategoryCode"]),
                            roomName: String(row["roomName"]),
                            locationCode: String(row["locationCode"]),
                            assetCount: Number(row["assetCount"] || 0),
                            assetCondition: String(row["assetCondition"]),
                            remarks: String(row["remarks"]),
                        },
                    });
                    createdAssets.push(asset);
                }

                return {
                    message: `Successfully created ${createdAssets.length} tools`,
                    assets: createdAssets,
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

    ipcMain.handle(
        "asset:createAsset",
        async (_, assetData: CreateAssetDto) => {
            const qrCodeData = `TOOL-${assetData.assetName}-${Date.now()}`;

            const asset = await prisma.asset.create({
                data: {
                    qrCode: qrCodeData,
                    temporaryTagNumber: assetData.temporaryTagNumber,
                    assetName: assetData.assetName,
                    assetDescription: assetData.assetDescription,
                    serialNumber: assetData.serialNumber,
                    assetCategoryCode: assetData.assetCategoryCode,
                    roomName: assetData.roomName,
                    locationCode: assetData.locationCode,
                    assetCount: assetData.assetCount,
                    assetCondition: assetData.assetCondition,
                    remarks: assetData.remarks,
                },
            });

            return asset;
        },
    );

    ipcMain.handle("asset:getTotalAssets", async () => {
        const [totalAssets, totalQuantity] = await Promise.all([
            prisma.asset.count(),
            prisma.asset.aggregate({
                _sum: {
                    assetCount: true,
                },
            }),
        ]);

        return {
            totalAssets,
            totalQuantity: totalQuantity._sum.assetCount ?? 0,
        };
    });

    ipcMain.handle(
        "asset:getAllAssets",
        async (_, params: PaginationParams) => {
            const { page, pageSize, search, sortBy, sortOrder } = params;

            const where = search
                ? {
                      OR: [
                          { temporaryTagNumber: { contains: search } },
                          { assetName: { contains: search } },
                      ],
                  }
                : undefined;

            const [assets, totalCount] = await Promise.all([
                prisma.asset.findMany({
                    where,
                    orderBy: sortBy
                        ? { [sortBy]: sortOrder || "asc" }
                        : undefined,
                    skip: page * pageSize,
                    take: pageSize,
                }),
                prisma.asset.count({ where }),
            ]);

            if (assets.length === 0) {
                return { data: [], totalCount: 0 };
            }

            const updatedAssets = await Promise.all(
                assets.map(async (asset) => {
                    const borrowedCount = await prisma.transaction.count({
                        where: {
                            assetId: asset.id,
                            status: {
                                in: ["BORROWED", "UNRETURNED"],
                            },
                        },
                    });

                    const availableCount = asset.assetCount - borrowedCount;
                    const qrCodeBuffer = await QRCode.toBuffer(asset.qrCode, {
                        width: 500,
                        margin: 2,
                    });
                    const qrCodeBase64 = `data:image/png;base64,${qrCodeBuffer.toString("base64")}`;
                    return {
                        ...asset,
                        qrCodeImage: qrCodeBase64,
                        borrowedCount,
                        availableCount,
                    };
                }),
            );

            return { data: updatedAssets, totalCount };
        },
    );

    ipcMain.handle("asset:getAssets", async () => {
        try {
            const assets = await prisma.asset.findMany({
                select: {
                    qrCode: true,
                    assetName: true,
                },
            });

            const formatted = assets.map((asset) => ({
                value: asset.qrCode,
                label: asset.assetName,
            }));

            return formatted;
        } catch (error) {
            throw new Error("Failed to fetch assets");
        }
    });

    ipcMain.handle("asset:exportAllAssets", async () => {
        const assets = await prisma.asset.findMany({
            orderBy: { assetName: "asc" },
        });

        // const borrowedCounts = await prisma.transaction.groupBy({
        //     by: ["assetId"],
        //     where: { status: { in: ["BORROWED", "UNRETURNED"] } },
        //     _count: true,
        // });

        // const countMap = new Map(
        //     borrowedCounts.map((b) => [b.assetId, b._count]),
        // );

        // return assets.map((asset) => ({
        //     ...asset,
        //     borrowedCount: countMap.get(asset.id) ?? 0,
        //     availableCount: asset.assetCount - (countMap.get(asset.id) ?? 0),
        // }));

        return Promise.all(
            assets.map(async (asset) => {
                const borrowedCount = await prisma.transaction.count({
                    where: {
                        assetId: asset.id,
                        status: {
                            in: ["BORROWED", "UNRETURNED"],
                        },
                    },
                });

                const availableCount = asset.assetCount - borrowedCount;
                const qrCodeBuffer = await QRCode.toBuffer(asset.qrCode, {
                    width: 500,
                    margin: 2,
                });
                const qrCodeBase64 = `data:image/png;base64,${qrCodeBuffer.toString("base64")}`;
                return {
                    ...asset,
                    qrCodeImage: qrCodeBase64,
                    borrowedCount,
                    availableCount,
                };
            }),
        );
    });

    ipcMain.handle("asset:getAssetById", async (_, assetId: string) => {
        const asset = await prisma.asset.findUnique({
            where: { id: assetId },
        });

        if (!asset) {
            throw new Error("Tool not found");
        }

        return asset;
    });

    ipcMain.handle("asset:updateAssetById", async (_, assetData: Asset) => {
        const asset = await prisma.asset.findUnique({
            where: {
                id: assetData.id,
            },
        });

        if (!asset) {
            throw new Error("Tool not found");
        }

        const qrCodeData = `TOOL-${assetData.assetName}-${Date.now()}`;

        const updatedAsset = await prisma.asset.update({
            where: {
                id: assetData.id,
            },
            data: {
                qrCode: qrCodeData,
                temporaryTagNumber: assetData.temporaryTagNumber,
                assetName: assetData.assetName,
                assetDescription: assetData.assetDescription,
                serialNumber: assetData.serialNumber,
                assetCategoryCode: assetData.assetCategoryCode,
                roomName: assetData.roomName,
                locationCode: assetData.locationCode,
                assetCount: assetData.assetCount,
                assetCondition: assetData.assetCondition,
                remarks: assetData.remarks,
            },
        });

        return {
            message: `Tool "${updatedAsset.assetName}" updated successfully.`,
            asset: updatedAsset,
        };
    });

    ipcMain.handle("asset:deleteAssetById", async (_, assetId: string) => {
        const asset = await prisma.asset.findUnique({
            where: {
                id: assetId,
            },
        });

        if (!asset) {
            throw new Error("Tool not found");
        }

        await prisma.asset.delete({
            where: {
                id: assetId,
            },
        });

        return {
            message: `Tool "${asset.assetName}" deleted successfully.`,
        };
    });

    ipcMain.handle(
        "asset:deleteSelectedAssets",
        async (_, assetIds: string[]) => {
            if (!assetIds || assetIds.length === 0) {
                throw new Error("No tools selected for deletion.");
            }

            await prisma.transaction.deleteMany({
                where: { assetId: { in: assetIds } },
            });

            const result = await prisma.asset.deleteMany({
                where: { id: { in: assetIds } },
            });

            return {
                message: `${result.count} tool(s) deleted successfully.`,
            };
        },
    );

    ipcMain.handle("asset:deleteAllAssets", async () => {
        await prisma.transaction.deleteMany();
        await prisma.asset.deleteMany();

        return {
            message: "All tools have been deleted.",
        };
    });

    ipcMain.handle(
        "asset:exportAssetsWithSpreadsheet",
        async (_, params: Omit<PaginationParams, "page" | "pageSize">) => {
            const { search, sortBy, sortOrder } = params;

            const sortField = sortBy === "name" ? "lastName" : sortBy;

            const where = search
                ? {
                      OR: [
                          { temporaryTagNumber: { contains: search } },
                          { assetName: { contains: search } },
                      ],
                  }
                : undefined;

            const assets = await prisma.asset.findMany({
                where,
                orderBy: sortField
                    ? { [sortField]: sortOrder || "asc" }
                    : undefined,
            });

            if (assets.length === 0) {
                return { success: false, error: "No assets found to export." };
            }

            const { filePath, canceled } = await dialog.showSaveDialog({
                title: "Export Assets",
                defaultPath: `assets_${getFormattedDate()}.xlsx`,
                filters: [{ name: "Excel File", extensions: ["xlsx"] }],
            });

            if (canceled || !filePath) return { success: false };

            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet("Assets");

            worksheet.columns = [
                { header: "QR Code", key: "qrCode", width: 20 },
                { header: "ID", key: "id", width: 30 },
                { header: "Tag Number", key: "temporaryTagNumber", width: 18 },
                { header: "Asset Name", key: "assetName", width: 18 },
                {
                    header: "Asset Description",
                    key: "assetDescription",
                    width: 18,
                },
                { header: "Serial Number", key: "serialNumber", width: 18 },
                {
                    header: "Asset Category Code",
                    key: "assetCategoryCode",
                    width: 12,
                },
                { header: "Room Name", key: "roomName", width: 20 },
                { header: "Location Code", key: "locationCode", width: 12 },
                { header: "Asset Count", key: "assetCount", width: 25 },
                { header: "Asset Condition", key: "assetCondition", width: 15 },
                { header: "Remarks", key: "remarks", width: 12 },
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

            for (let i = 0; i < assets.length; i++) {
                const asset = assets[i];
                const rowIndex = i + 2;

                const row = worksheet.addRow({
                    qrCode: "",
                    id: asset.id,
                    temporaryTagNumber: asset.temporaryTagNumber,
                    assetName: asset.assetName,
                    assetDescription: asset.assetDescription ?? "—",
                    serialNumber: asset.serialNumber ?? "—",
                    assetCategoryCode: asset.assetCategoryCode ?? "—",
                    roomName: asset.roomName ?? "—",
                    locationCode: asset.locationCode ?? "—",
                    assetCount: asset.assetCount ?? 0,
                    assetCondition: asset.assetCondition ?? "—",
                    remarks: asset.remarks ?? "—",
                });

                row.height = imageRowHeight;

                row.eachCell((cell) => {
                    cell.alignment = {
                        vertical: "middle",
                        horizontal: "center",
                    };
                });

                const qrCodeBuffer = await QRCode.toBuffer(asset.qrCode, {
                    width: 100,
                    margin: 1,
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
