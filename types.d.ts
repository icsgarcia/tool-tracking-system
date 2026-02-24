interface CreateUserDto {
    schoolNumber: string;
    firstName: string;
    middleName: string;
    lastName: string;
    role: Role;
    department: string;
    yearLevel: number;
    email: string;
    number?: string | null;
}

interface UpdateUserDto extends CreateUserDto {
    id: string;
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

interface Window {
    api: {
        user: {
            createUserByFile: (fileBuffer: ArrayBuffer) => Promise<any>;
            createUser: (userData: CreateUserDto) => Promise<any>;
            getUserQRCode: (userId: string) => Promise<any>;
            getUserQRCodeBuffer: (userId: string) => Promise<any>;
            getAllUsers: () => Promise<any[]>;
            getUserById: (userId: string) => Promise<any>;
            getUserByQRCode: (qrCode: string) => Promise<any>;
            updateUserById: (userData: UpdateUserDto) => Promise<any>;
            deleteUserById: (userId: string) => Promise<any>;
            deleteAllUsers: (userId: string) => Promise<any>;
        };
        asset: {
            createAssetByFile: (fileBuffer: ArrayBuffer) => Promise<any>;
            createAsset: (assetData: CreateAssetDto) => Promise<any>;
            getAllAssets: () => Promise<any[]>;
            getAssetById: (assetId: string) => Promise<any>;
            updateAssetById: (assetData: UpdateAssetDto) => Promise<any>;
            deleteAssetById: (assetId: string) => Promise<any>;
            deleteAllAssets: () => Promise<any>;
        };
        transaction: {
            getAllTransactions: () => Promise<any[]>;
            getUserTransactions: (userId: string) => Promise<any>;
            scanAssetQrCode: (data: {
                userId: string;
                assetQrCode: string;
            }) => Promise<any>;
        };
    };
}
