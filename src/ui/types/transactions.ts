enum Status {
    BORROWED = "BORROWED",
    RETURNED = "RETURNED",
}

enum Role {
    STUDENT = "STUDENT",
    TEACHER = "TEACHER",
    STAFF = "STAFF",
    ADMIN = "ADMIN",
}

enum UserStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
}

export interface UserTransactions {
    id: string;
    userId: string;
    assetId: string;
    status: Status;
    borrowedAt: string;
    returnedAt?: string;
    asset: {
        id: string;
        qrCode: string;
        assetName: string;
        assetCount: number;
    };
}

export interface Transactions extends UserTransactions {
    user: {
        id: string;
        qrCode: string;
        schoolNumber: string;
        firstName: string;
        middleName: string;
        lastName: string;
        role: Role;
        department: string;
        yearLevel: number;
        email: string;
        number: string;
        status: UserStatus;
    };
}
