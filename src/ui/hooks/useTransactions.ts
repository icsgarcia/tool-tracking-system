import api from "@/lib/api";
import type { Transactions, UserTransactions } from "@/types/transactions";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useTransactions = () => {
    return useQuery<Transactions[]>({
        queryKey: ["transactions"],
        queryFn: async () => {
            const response = await api.get<Transactions[]>("/transaction");
            return response.data;
        },
    });
};

export const useUserTransactions = (userId: string) => {
    return useQuery<UserTransactions[]>({
        queryKey: ["userTransactions", userId],
        queryFn: async () => {
            const response = await api.get<UserTransactions[]>(
                `/transaction/user/${userId}`,
            );
            return response.data;
        },
        enabled: !!userId,
    });
};

export const useScanForTransaction = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: { userId: string; toolQrCode: string }) => {
            const response = await api.post("/transaction/scan", data);
            return response.data;
        },
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
