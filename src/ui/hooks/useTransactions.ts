import api from "@/lib/api";
import type { UserTransactions } from "@/types/userTransactions";
import { useQuery } from "@tanstack/react-query";

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
