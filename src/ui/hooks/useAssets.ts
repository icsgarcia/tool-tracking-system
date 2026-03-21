import {
    keepPreviousData,
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

export const useGetTotalAssets = () => {
    return useQuery({
        queryKey: ["totalAssets"],
        queryFn: () => window.api.asset.getTotalAssets(),
    });
};

export const useGetAllAssets = (params: PaginationParams) => {
    return useQuery({
        queryKey: ["assets", params],
        queryFn: () => window.api.asset.getAllAssets(params),
        placeholderData: keepPreviousData,
    });
};

export const useGetAsset = (assetId: string) => {
    return useQuery({
        queryKey: ["asset", assetId],
        queryFn: () => window.api.asset.getAssetById(assetId),
        enabled: !!assetId,
    });
};

export const useCreateAsset = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: CreateAssetDto) =>
            window.api.asset.createAsset(data),
        onSuccess: () => {
            toast.success("Asset created successfully!");
            queryClient.invalidateQueries({ queryKey: ["assets"] });
        },
        onError: (error) => {
            toast.error(error.message || "Failed to create tool");
        },
    });
};

export const useCreateAssetByFile = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (file: File) => {
            const buffer = await file!.arrayBuffer();
            return window.api.asset.createAssetByFile(buffer);
        },
        onSuccess: (data) => {
            toast.success(
                `Successfully created ${data?.assets?.length ?? ""} tools from file!`,
            );
            queryClient.invalidateQueries({ queryKey: ["assets"] });
        },
        onError: (error) => {
            toast.error(error.message || "Failed to create tools from file");
        },
    });
};

export const useUpdateAsset = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (assetData: UpdateAssetDto) =>
            window.api.asset.updateAssetById(assetData),
        onSuccess: (data, assetData) => {
            toast.success(
                data?.message ||
                    `Tool "${assetData.assetName}" updated successfully!`,
            );
            queryClient.invalidateQueries({ queryKey: ["assets"] });
        },
        onError: (error) => {
            toast.error(error?.message || "Failed to update tool");
        },
    });
};

export const useDeleteAsset = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (assetId: string) =>
            window.api.asset.deleteAssetById(assetId),
        onSuccess: (data) => {
            toast.success(data?.message || "Tool deleted successfully!");
            queryClient.invalidateQueries({ queryKey: ["assets"] });
        },
        onError: (error) => {
            toast.error(error?.message || "Failed to delete tool");
        },
    });
};

export const useDeleteSelectedAssets = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (assetIds: string[]) =>
            window.api.asset.deleteSelectedAssets(assetIds),
        onSuccess: (data) => {
            toast.success(
                data?.message || "Selected tools deleted successfully!",
            );
            queryClient.invalidateQueries({ queryKey: ["assets"] });
            queryClient.invalidateQueries({ queryKey: ["totalAssets"] });
            queryClient.invalidateQueries({ queryKey: ["transactions"] });
            queryClient.invalidateQueries({ queryKey: ["totalTransactions"] });
        },
        onError: (error) => {
            toast.error(error?.message || "Failed to delete selected tools");
        },
    });
};

export const useDeleteAllAssets = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => window.api.asset.deleteAllAssets(),
        onSuccess: (data) => {
            toast.success(
                data?.message || "All tools have been deleted successfully!",
            );
            queryClient.invalidateQueries({ queryKey: ["assets"] });
            queryClient.invalidateQueries({ queryKey: ["totalAssets"] });
            queryClient.invalidateQueries({ queryKey: ["transactions"] });
            queryClient.invalidateQueries({ queryKey: ["totalTransactions"] });
        },
        onError: (error) => {
            toast.error(error?.message || "Failed to delete all tools");
        },
    });
};
