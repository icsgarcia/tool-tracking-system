import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useGetAllUsers = () => {
    return useQuery({
        queryKey: ["users"],
        queryFn: () => window.api.user.getAllUsers(),
    });
};

export const useGetUser = (userId: string) => {
    return useQuery({
        queryKey: ["user", userId],
        queryFn: () => window.api.user.getUserById(userId),
        enabled: !!userId,
    });
};

export const useScanUser = () => {
    return useMutation({
        mutationFn: (qrCode: string) => window.api.user.getUserByQRCode(qrCode),
    });
};

export const useGetUserQrCode = (userId: string) => {
    return useQuery({
        queryKey: ["userQrCode", userId],
        queryFn: () => window.api.user.getUserQRCodeBuffer(userId),
    });
};

export const useCreateUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: {
            schoolNumber: string;
            firstName: string;
            middleName: string;
            lastName: string;
            role: string;
            department: string;
            yearLevel: number;
            email: string;
            number?: string | null;
        }) => window.api.user.createUser(data),
        onSuccess: () => {
            toast.success("User created successfully!");
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
        onError: (error) => {
            toast.error(error.message || "Failed to create user");
        },
    });
};
export const useCreateUserByFile = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (file: File) => {
            const buffer = await file!.arrayBuffer();
            return window.api.user.createUserByFile(buffer);
        },
        onSuccess: (data) => {
            toast.success(
                `Successfully created ${data?.users?.length ?? ""} users from file!`,
            );
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
        onError: (error) => {
            toast.error(error.message || "Failed to create users from file");
        },
    });
};

export const useUpdateUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (userData: UpdateUserDto) =>
            window.api.user.updateUserById(userData),
        onSuccess: (data, userData) => {
            toast.success(
                data?.message ||
                    `User "${userData.firstName} ${userData.lastName}" updated successfully!`,
            );
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
        onError: (error) => {
            toast.error(error?.message || "Failed to update user");
        },
    });
};

export const useDeleteUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (userId: string) => window.api.user.deleteUserById(userId),
        onSuccess: (data) => {
            toast.success(data?.message || "User deleted successfully!");
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
        onError: (error) => {
            toast.error(error?.message || "Failed to delete user");
        },
    });
};
