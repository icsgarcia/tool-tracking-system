import {
    keepPreviousData,
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

export const useGetTotalTransactions = () => {
    return useQuery({
        queryKey: ["totalTransactions"],
        queryFn: () => window.api.transaction.getTotalTransactions(),
    });
};

export const useGetAllTransactions = (params: PaginationParams) => {
    return useQuery({
        queryKey: ["transactions", params],
        queryFn: () => window.api.transaction.getAllTransactions(params),
        placeholderData: keepPreviousData,
    });
};

export const useGetUserTransactions = (
    userId: string,
    params: PaginationParams,
) => {
    return useQuery({
        queryKey: ["userTransactions", userId, params],
        queryFn: () =>
            window.api.transaction.getUserTransactions(userId, params),
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
