import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useGetAllTransactions = () => {
    return useQuery<Transactions[]>({
        queryKey: ["transactions"],
        queryFn: () => window.api.transaction.getAllTransactions(),
    });
};

export const useGetUserTransactions = (userId: string) => {
    return useQuery<UserTransactions[]>({
        queryKey: ["userTransactions", userId],
        queryFn: () => window.api.transaction.getUserTransactions(userId),
        enabled: !!userId,
    });
};

export const useBorrowAsset = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (variables: {
            userId: string;
            assetQrCode: string;
            borrowCount: number;
        }) => window.api.transaction.borrowAsset(variables),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["transactions"],
            });
            queryClient.invalidateQueries({
                queryKey: ["userTransactions", variables.userId],
            });
            toast.success(data.message);
        },
        onError: () => {},
    });
};

export const useReturnAsset = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (variables: {
            userId: string;
            assetQrCode: string;
            returnCount: number;
        }) => window.api.transaction.returnAsset(variables),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["transactions"],
            });
            queryClient.invalidateQueries({
                queryKey: ["userTransactions", variables.userId],
            });
            toast.success(data.message);
        },
        onError: () => {},
    });
};

export const useScanForTransaction = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (variables: { userId: string; assetQrCode: string }) =>
            window.api.transaction.scanAssetQrCode(variables),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["transactions"],
            });
            queryClient.invalidateQueries({
                queryKey: ["userTransactions", variables.userId],
            });
            toast.success(data.message);
        },
        onError: () => {},
    });
};
