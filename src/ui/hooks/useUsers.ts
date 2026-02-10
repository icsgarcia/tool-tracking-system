import api from "@/lib/api";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useUsers = () => {
    return useQuery({
        queryKey: ["users"],
        queryFn: async () => {
            const response = await api.get("/user");
            return response.data;
        },
    });
};

export const useUser = (userId: string) => {
    return useQuery({
        queryKey: ["user", userId],
        queryFn: async () => {
            const response = await api.get(`/user/${userId}`);
            return response.data;
        },
        enabled: !!userId,
    });
};

export const useScanUser = () => {
    return useMutation({
        mutationFn: async (qrCode: string) => {
            const response = await api.get("/user/scan", {
                params: { qrCode },
            });
            return response.data;
        },
    });
};
