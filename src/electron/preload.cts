import { Asset, User } from "../../generated/prisma/client";

const electron = require("electron");

electron.contextBridge.exposeInMainWorld("api", {
    user: {
        createUserByFile: (fileBuffer: ArrayBuffer) =>
            electron.ipcRenderer.invoke("user:createUserByFile", fileBuffer),
        createUser: (userData: CreateUserDto) =>
            electron.ipcRenderer.invoke("user:createUser", userData),
        getUserQRCode: (userId: string) =>
            electron.ipcRenderer.invoke("user:getUserQRCode", userId),
        getUserQRCodeBuffer: (userId: string) =>
            electron.ipcRenderer.invoke("user:getUserQRCodeBuffer", userId),
        getTotalUsers: () => electron.ipcRenderer.invoke("user:getTotalUsers"),
        getAllUsers: (params: PaginationParams) =>
            electron.ipcRenderer.invoke("user:getAllUsers", params),
        getUserById: (userId: string) =>
            electron.ipcRenderer.invoke("user:getUserById", userId),
        getUserByQRCode: (qrCode: string) =>
            electron.ipcRenderer.invoke("user:getUserByQRCode", qrCode),
        updateUserById: (userData: User) =>
            electron.ipcRenderer.invoke("user:updateUserById", userData),
        deleteUserById: (userId: string) =>
            electron.ipcRenderer.invoke("user:deleteUserById", userId),
        deleteSelectedUsers: (userIds: string[], currentUserId: string) =>
            electron.ipcRenderer.invoke("user:deleteSelectedUsers", userIds, currentUserId),
        deleteAllUsers: (userId: string) =>
            electron.ipcRenderer.invoke("user:deleteAllUsers", userId),
        exportAllUsers: () =>
            electron.ipcRenderer.invoke("user:exportAllUsers"),
    },

    asset: {
        createAssetByFile: (fileBuffer: ArrayBuffer) =>
            electron.ipcRenderer.invoke("asset:createAssetByFile", fileBuffer),
        createAsset: (assetData: CreateAssetDto) =>
            electron.ipcRenderer.invoke("asset:createAsset", assetData),
        getTotalAssets: () =>
            electron.ipcRenderer.invoke("asset:getTotalAssets"),
        getAllAssets: (params: PaginationParams) =>
            electron.ipcRenderer.invoke("asset:getAllAssets", params),
        getAssetById: (assetId: string) =>
            electron.ipcRenderer.invoke("asset:getAssetById", assetId),
        updateAssetById: (assetData: Asset) =>
            electron.ipcRenderer.invoke("asset:updateAssetById", assetData),
        deleteAssetById: (assetId: string) =>
            electron.ipcRenderer.invoke("asset:deleteAssetById", assetId),
        deleteSelectedAssets: (assetIds: string[]) =>
            electron.ipcRenderer.invoke("asset:deleteSelectedAssets", assetIds),
        deleteAllAssets: () =>
            electron.ipcRenderer.invoke("asset:deleteAllAssets"),
        exportAllAssets: () =>
            electron.ipcRenderer.invoke("asset:exportAllAssets"),
    },

    transaction: {
        getTotalTransactions: () =>
            electron.ipcRenderer.invoke("transaction:getTotalTransactions"),
        getAllTransactions: (params: PaginationParams) =>
            electron.ipcRenderer.invoke(
                "transaction:getAllTransactions",
                params,
            ),
        getUserTransactions: (userId: string, params: PaginationParams) =>
            electron.ipcRenderer.invoke(
                "transaction:getUserTransactions",
                userId,
                params,
            ),
        borrowAsset: (data: {
            userId: string;
            assetQrCode: string;
            borrowCount: number;
        }) =>
            electron.ipcRenderer.invoke(
                "transaction:borrowAsset",
                data.userId,
                data.assetQrCode,
                data.borrowCount,
            ),
        returnAsset: (data: {
            userId: string;
            assetQrCode: string;
            returnCount: number;
        }) =>
            electron.ipcRenderer.invoke(
                "transaction:returnAsset",
                data.userId,
                data.assetQrCode,
                data.returnCount,
            ),
        scanAssetQrCode: (data: { userId: string; assetQrCode: string }) =>
            electron.ipcRenderer.invoke(
                "transaction:scanAssetQrCode",
                data.userId,
                data.assetQrCode,
            ),
        exportAllTransactions: () =>
            electron.ipcRenderer.invoke("transaction:exportAllTransactions"),
    },

    print: {
        exportPdf: (html: string, defaultFilename: string) =>
            electron.ipcRenderer.invoke("exportPdf", html, defaultFilename),
    },

    database: {
        backup: () => electron.ipcRenderer.invoke("database:backup"),
        restore: () => electron.ipcRenderer.invoke("database:restore"),
    },
});
