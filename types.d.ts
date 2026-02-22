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

interface CreateToolDto {
    name: string;
    quantity: number;
}

interface UpdateToolDto extends CreateToolDto {
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
        };
        tool: {
            createToolByFile: (fileBuffer: ArrayBuffer) => Promise<any>;
            createTool: (toolData: CreateToolDto) => Promise<any>;
            getAllTools: () => Promise<any[]>;
            getToolById: (toolId: string) => Promise<any>;
            updateToolById: (toolData: UpdateToolDto) => Promise<any>;
            deleteToolById: (toolId: string) => Promise<any>;
        };
        transaction: {
            getAllTransactions: () => Promise<any[]>;
            getUserTransactions: (userId: string) => Promise<any>;
            scanToolQrCode: (data: {
                userId: string;
                toolQrCode: string;
            }) => Promise<any>;
        };
    };
}
