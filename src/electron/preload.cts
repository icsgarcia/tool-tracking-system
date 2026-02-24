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
        getAllUsers: () => electron.ipcRenderer.invoke("user:getAllUsers"),
        getUserById: (userId: string) =>
            electron.ipcRenderer.invoke("user:getUserById", userId),
        getUserByQRCode: (qrCode: string) =>
            electron.ipcRenderer.invoke("user:getUserByQRCode", qrCode),
        updateUserById: (userData: User) =>
            electron.ipcRenderer.invoke("user:updateUserById", userData),
        deleteUserById: (userId: string) =>
            electron.ipcRenderer.invoke("user:deleteUserById", userId),
        deleteAllUsers: (userId: string) =>
            electron.ipcRenderer.invoke("user:deleteAllUsers", userId),
    },

    asset: {
        createAssetByFile: (fileBuffer: ArrayBuffer) =>
            electron.ipcRenderer.invoke("asset:createAssetByFile", fileBuffer),
        createAsset: (assetData: CreateAssetDto) =>
            electron.ipcRenderer.invoke("asset:createAsset", assetData),
        getAllAssets: () => electron.ipcRenderer.invoke("asset:getAllAssets"),
        getAssetById: (assetId: string) =>
            electron.ipcRenderer.invoke("asset:getAssetById", assetId),
        updateAssetById: (assetData: Asset) =>
            electron.ipcRenderer.invoke("asset:updateAssetById", assetData),
        deleteAssetById: (assetId: string) =>
            electron.ipcRenderer.invoke("asset:deleteAssetById", assetId),
        deleteAllAssets: () =>
            electron.ipcRenderer.invoke("asset:deleteAllAssets"),
    },

    transaction: {
        getAllTransactions: () =>
            electron.ipcRenderer.invoke("transaction:getAllTransactions"),
        getUserTransactions: (userId: string) =>
            electron.ipcRenderer.invoke(
                "transaction:getUserTransactions",
                userId,
            ),
        scanAssetQrCode: (data: { userId: string; assetQrCode: string }) =>
            electron.ipcRenderer.invoke(
                "transaction:scanAssetQrCode",
                data.userId,
                data.assetQrCode,
            ),
    },
});
