enum Status {
    BORROWED = "BORROWED",
    UNRETURNED = "UNRETURNED",
    RETURNED = "RETURNED",
}

enum Role {
    STUDENT = "STUDENT",
    STAFF = "STAFF",
    ADMIN = "ADMIN",
}

enum UserStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
}

interface PaginationParams {
    page: number;
    pageSize: number;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    range?: "today" | "week" | "month";
}

interface User {
    id: string;
    qrCode: string;
    qrCodeImage: string;
    schoolNumber: string;
    firstName: string;
    middleName: string;
    lastName: string;
    role: string;
    department: string;
    yearLevel: number;
    email: string;
    number?: string;
    status: string;
}

interface CreateUserDto {
    schoolNumber: string;
    firstName: string;
    middleName: string;
    lastName: string;
    role: string;
    department: string;
    yearLevel: number;
    email: string;
    number?: string;
}

interface UpdateUserDto extends CreateUserDto {
    id: string;
}

interface Asset {
    id: string;
    temporaryTagNumber?: string;
    qrCode: string;
    qrCodeImage: string;
    assetName: string;
    assetDescription: string;
    serialNumber?: string;
    assetCategoryCode?: string;
    roomName?: string;
    locationCode?: string;
    assetCount: number;
    borrowedCount: number;
    availableCount: number;
    assetCondition?: string;
    remarks?: string;
}

interface CreateAssetDto {
    temporaryTagNumber?: string;
    assetName: string;
    assetDescription?: string;
    serialNumber?: string;
    assetCategoryCode?: string;
    roomName?: string;
    locationCode?: string;
    assetCount: number;
    assetCondition?: string;
    remarks?: string;
}

interface UpdateAssetDto extends CreateAssetDto {
    id: string;
}

interface UserTransactions {
    id: string;
    userId: string;
    assetId: string;
    borrowCount: number;
    returnCount: number;
    status: Status;
    borrowedAt: string;
    returnedAt?: string;
    remarks?: string;
    asset: {
        id: string;
        qrCode: string;
        assetName: string;
        assetCount: number;
    };
}

interface Transactions extends UserTransactions {
    user: {
        id: string;
        qrCode: string;
        schoolNumber: string;
        firstName: string;
        middleName: string;
        lastName: string;
        role: string;
        department: string;
        yearLevel: number;
        email: string;
        number: string;
        status: UserStatus;
    };
    asset: {
        id: string;
        temporaryTagNumber: string;
        qrCode: string;
        assetName: string;
        assetDescription: string;
        serialNumber: string;
        assetCategoryCode: string;
        roomName: string;
        locationCode: string;
        assetCount: number;
        assetCondition: string;
        remarks: string;
    };
}

interface LoginData {
    email: string;
    password: string;
}

interface Window {
    api: {
        user: {
            manualLogin: (loginData: LoginData) => Promise<any>;
            createUserByFile: (fileBuffer: ArrayBuffer) => Promise<any>;
            createUser: (userData: CreateUserDto) => Promise<any>;
            loginBySchoolNumber: (schoolNumber: string) => Promise<any>;
            getStudentAndStaff: () => Promise<any>;
            getUserQRCode: (userId: string) => Promise<any>;
            getUserQRCodeBuffer: (userId: string) => Promise<any>;
            getTotalUsers: () => Promise<any>;
            getAllUsers: (params: PaginationParams) => Promise<any>;
            getUserById: (userId: string) => Promise<any>;
            getUserByQRCode: (qrCode: string) => Promise<any>;
            updateUserById: (userData: UpdateUserDto) => Promise<any>;
            deleteUserById: (userId: string) => Promise<any>;
            deleteSelectedUsers: (
                userIds: string[],
                currentUserId: string,
            ) => Promise<any>;
            deleteAllUsers: (userId: string) => Promise<any>;
            exportAllUsers: () => Promise<any>;
            exportUsersWithSpreadsheet: (
                params: Omit<PaginationParams, "page" | "pageSize">,
            ) => Promise<any>;
        };
        asset: {
            createAssetByFile: (fileBuffer: ArrayBuffer) => Promise<any>;
            createAsset: (assetData: CreateAssetDto) => Promise<any>;
            getTotalAssets: () => Promise<any>;
            getAllAssets: (params: PaginationParams) => Promise<any>;
            getAssets: () => Promise<any>;
            getAssetById: (assetId: string) => Promise<any>;
            updateAssetById: (assetData: UpdateAssetDto) => Promise<any>;
            deleteAssetById: (assetId: string) => Promise<any>;
            deleteSelectedAssets: (assetIds: string[]) => Promise<any>;
            deleteAllAssets: () => Promise<any>;
            exportAllAssets: () => Promise<any>;
            exportAssetsWithSpreadsheet: (
                params: Omit<PaginationParams, "page" | "pageSize">,
            ) => Promise<any>;
        };
        transaction: {
            getTotalTransactions: () => Promise<any>;
            getTransactions: (params: PaginationParams) => Promise<any>;
            getUserTransactions: (
                userId: string,
                params: PaginationParams,
            ) => Promise<any>;
            exportTransactionWithSpreadsheet: (
                params: Omit<PaginationParams, "page" | "pageSize">,
            ) => Promise<any>;
            exportUserTransactionWithSpreadsheet: (
                userId: string,
                params: Omit<PaginationParams, "page" | "pageSize">,
            ) => Promise<any>;
            borrowAsset: (data: {
                userId: string;
                assetQrCode: string;
                borrowCount: number;
            }) => Promise<any>;
            returnAsset: (data: {
                userId: string;
                assetQrCode: string;
                returnCount: number;
                remarks: string;
            }) => Promise<any>;
            scanAssetQrCode: (data: {
                userId: string;
                assetQrCode: string;
            }) => Promise<any>;
            exportAllTransactions: () => Promise<any>;
        };
        print: {
            exportPdf: (
                html: string,
                defaultFilename: string,
            ) => Promise<{ success: boolean; filePath?: string }>;
        };
        database: {
            backup: () => Promise<{
                success: boolean;
                filePath?: string;
                error?: string;
            }>;
            restore: () => Promise<{
                success: boolean;
                error?: string;
            }>;
        };
    };
}
