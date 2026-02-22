import { Tool, User } from "../../generated/prisma/client";

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

    tool: {
        createToolByFile: (fileBuffer: ArrayBuffer) =>
            electron.ipcRenderer.invoke("tool:createToolByFile", fileBuffer),
        createTool: (toolData: CreateToolDto) =>
            electron.ipcRenderer.invoke("tool:createTool", toolData),
        getAllTools: () => electron.ipcRenderer.invoke("tool:getAllTools"),
        getToolById: (toolId: string) =>
            electron.ipcRenderer.invoke("tool:getToolById", toolId),
        updateToolById: (toolData: Tool) =>
            electron.ipcRenderer.invoke("tool:updateToolById", toolData),
        deleteToolById: (toolId: string) =>
            electron.ipcRenderer.invoke("tool:deleteToolById", toolId),
        deleteAllTools: () =>
            electron.ipcRenderer.invoke("tool:deleteAllTools"),
    },

    transaction: {
        getAllTransactions: () =>
            electron.ipcRenderer.invoke("transaction:getAllTransactions"),
        getUserTransactions: (userId: string) =>
            electron.ipcRenderer.invoke(
                "transaction:getUserTransactions",
                userId,
            ),
        scanToolQrCode: (data: { userId: string; toolQrCode: string }) =>
            electron.ipcRenderer.invoke(
                "transaction:scanToolQrCode",
                data.userId,
                data.toolQrCode,
            ),
    },
});
