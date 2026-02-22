import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useGetAllTools = () => {
    return useQuery({
        queryKey: ["tools"],
        queryFn: () => window.api.tool.getAllTools(),
    });
};

export const useGetTool = (toolId: string) => {
    return useQuery({
        queryKey: ["tool", toolId],
        queryFn: () => window.api.tool.getToolById(toolId),
        enabled: !!toolId,
    });
};

export const useCreateTool = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: { name: string; quantity: number }) =>
            window.api.tool.createTool(data),
        onSuccess: () => {
            toast.success("Tool created successfully!");
            queryClient.invalidateQueries({ queryKey: ["tools"] });
        },
        onError: (error) => {
            toast.error(error.message || "Failed to create tool");
        },
    });
};

export const useCreateToolByFile = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (file: File) => {
            const buffer = await file!.arrayBuffer();
            return window.api.tool.createToolByFile(buffer);
        },
        onSuccess: (data) => {
            toast.success(
                `Successfully created ${data?.tools?.length ?? ""} tools from file!`,
            );
            queryClient.invalidateQueries({ queryKey: ["tools"] });
        },
        onError: (error) => {
            toast.error(error.message || "Failed to create tools from file");
        },
    });
};

export const useUpdateTool = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (toolData: UpdateToolDto) =>
            window.api.tool.updateToolById(toolData),
        onSuccess: (data, toolData) => {
            toast.success(
                data?.message ||
                    `Tool "${toolData.name}" updated successfully!`,
            );
            queryClient.invalidateQueries({ queryKey: ["tools"] });
        },
        onError: (error) => {
            toast.error(error?.message || "Failed to update tool");
        },
    });
};

export const useDeleteTool = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (toolId: string) => window.api.tool.deleteToolById(toolId),
        onSuccess: (data) => {
            toast.success(data?.message || "Tool deleted successfully!");
            queryClient.invalidateQueries({ queryKey: ["tools"] });
        },
        onError: (error) => {
            toast.error(error?.message || "Failed to delete tool");
        },
    });
};

export const useDeleteAllTools = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => window.api.tool.deleteAllTools(),
        onSuccess: (data) => {
            toast.success(
                data?.message || "All tools have been deleted successfully!",
            );
            queryClient.invalidateQueries({ queryKey: ["tools"] });
        },
        onError: (error: any) => {
            toast.error(error?.message || "Failed to delete all tools");
        },
    });
};
