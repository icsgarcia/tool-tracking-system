enum Status {
    BORROWED = "BORROWED",
    RETURNED = "RETURNED",
}

export interface UserTransactions {
    id: string;
    userId: string;
    toolId: string;
    status: Status;
    borrowedAt: string;
    returnedAt?: string;
    tool: {
        id: string;
        qrCode: string;
        name: string;
        quantity: number;
    };
}
