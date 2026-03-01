import { ipcMain } from "electron";
import { getPrisma } from "../database/db.js";
import QRCode from "qrcode";
import * as XLSX from "xlsx";
import { Asset } from "../../../generated/prisma/client.js";
import { randomUUID } from "crypto";

export function AssetHandlers() {
    const prisma = getPrisma();

    // Create assets from Excel file (receives file buffer from renderer)
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
                    const qrCodeData = `ASSET-${row["temporaryTagNumber"]}-${randomUUID()}`;

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
                    message: `Successfully created ${createdAssets.length} assets`,
                    assets: createdAssets,
                };
            } catch (error) {
                console.error(error);
                throw new Error("Failed to import Excel file");
            }
        },
    );

    // Create a single asset
    ipcMain.handle(
        "asset:createAsset",
        async (_, assetData: CreateAssetDto) => {
            const qrCodeData = `ASSET-${assetData.assetName}-${Date.now()}`;

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

    // Get all assets with QR code images
    ipcMain.handle("asset:getAllAssets", async () => {
        const assets = await prisma.asset.findMany();

        if (assets.length === 0) {
            return [];
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

        return updatedAssets;
    });

    // Get asset by ID
    ipcMain.handle("asset:getAssetById", async (_, assetId: string) => {
        const asset = await prisma.asset.findUnique({
            where: { id: assetId },
        });

        if (!asset) {
            throw new Error("Asset not found");
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
            throw new Error("Asset not found");
        }

        const qrCodeData = `ASSET-${assetData.assetName}-${Date.now()}`;

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
            message: `Asset "${updatedAsset.assetName}" updated successfully.`,
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
            throw new Error("Asset not found");
        }

        await prisma.asset.delete({
            where: {
                id: assetId,
            },
        });

        return {
            message: `Asset "${asset.assetName}" deleted successfully.`,
        };
    });

    ipcMain.handle("asset:deleteAllAssets", async () => {
        await prisma.asset.deleteMany();

        return {
            message: "All assets have been deleted.",
        };
    });
}
