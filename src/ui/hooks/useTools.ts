import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export const useTools = () => {
    return useQuery({
        queryKey: ["tools"],
        queryFn: async () => {
            const response = await api.get("/tool");
            return response.data;
        },
    });
};

export const useTool = (toolId: string) => {
    return useQuery({
        queryKey: ["tool", toolId],
        queryFn: async () => {
            const response = await api.get(`/tool/${toolId}`);
            return response.data;
        },
        enabled: !!toolId,
    });
};
