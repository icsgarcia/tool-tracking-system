import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useGetAllAssets = () => {
    return useQuery({
        queryKey: ["assets"],
        queryFn: () => window.api.asset.getAllAssets(),
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
            toast.error(error.message || "Failed to create asset");
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
                `Successfully created ${data?.assets?.length ?? ""} assets from file!`,
            );
            queryClient.invalidateQueries({ queryKey: ["assets"] });
        },
        onError: (error) => {
            toast.error(error.message || "Failed to create assets from file");
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
                    `Asset "${assetData.assetName}" updated successfully!`,
            );
            queryClient.invalidateQueries({ queryKey: ["assets"] });
        },
        onError: (error) => {
            toast.error(error?.message || "Failed to update asset");
        },
    });
};

export const useDeleteAsset = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (assetId: string) =>
            window.api.asset.deleteAssetById(assetId),
        onSuccess: (data) => {
            toast.success(data?.message || "Asset deleted successfully!");
            queryClient.invalidateQueries({ queryKey: ["assets"] });
        },
        onError: (error) => {
            toast.error(error?.message || "Failed to delete asset");
        },
    });
};

export const useDeleteAllAssets = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => window.api.asset.deleteAllAssets(),
        onSuccess: (data) => {
            toast.success(
                data?.message || "All assets have been deleted successfully!",
            );
            queryClient.invalidateQueries({ queryKey: ["assets"] });
        },
        onError: (error: any) => {
            toast.error(error?.message || "Failed to delete all assets");
        },
    });
};
