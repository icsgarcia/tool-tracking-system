import type { Dispatch, FormEvent, SetStateAction } from "react";
import { Button } from "./ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "./ui/dialog";
import { Separator } from "./ui/separator";
import { useDeleteUser } from "@/hooks/useUsers";
import { UserX, Trash2, X } from "lucide-react";

interface DeleteUserDialogProps {
    openDeleteUser: boolean;
    setOpenDeleteUser: Dispatch<SetStateAction<boolean>>;
    user: User;
}

const DeleteUserDialog = ({
    openDeleteUser,
    setOpenDeleteUser,
    user,
}: DeleteUserDialogProps) => {
    const deleteUser = useDeleteUser();

    const handleDeleteUser = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        deleteUser.mutate(user.id, {
            onSuccess: () => setOpenDeleteUser(false),
        });
    };
    return (
        <Dialog open={openDeleteUser} onOpenChange={setOpenDeleteUser}>
            <DialogContent className="max-w-md w-[calc(100%-2rem)] max-h-[85svh] flex flex-col gap-0 p-0 overflow-hidden">
                <form
                    onSubmit={handleDeleteUser}
                    className="flex flex-col gap-4 p-4 sm:p-6"
                >
                    <DialogHeader>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-destructive/10">
                                <UserX className="w-5 h-5 text-destructive" />
                            </div>
                            <div>
                                <DialogTitle className="text-base sm:text-lg">
                                    Confirm User Deletion
                                </DialogTitle>
                                <DialogDescription className="text-xs sm:text-sm">
                                    This action cannot be undone and will
                                    permanently remove the user and all
                                    associated data.
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    <Separator />

                    <div className="space-y-1 rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-sm">
                        <p>
                            <span className="font-bold">School Number:</span>{" "}
                            {user.schoolNumber}
                        </p>
                        <p>
                            <span className="font-bold">Name:</span>{" "}
                            {user.firstName} {user.middleName} {user.lastName}
                        </p>
                        <p>
                            <span className="font-bold">Role:</span> {user.role}
                        </p>
                        <p>
                            <span className="font-bold">Email:</span>{" "}
                            {user.email}
                        </p>
                        <p>
                            <span className="font-bold">Phone Number:</span>{" "}
                            {user.number}
                        </p>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">
                                <X className="w-4 h-4" />
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button
                            type="submit"
                            variant="destructive"
                            disabled={deleteUser.isPending}
                        >
                            <Trash2 className="w-4 h-4" />
                            {deleteUser.isPending
                                ? "Deleting..."
                                : "Delete User"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default DeleteUserDialog;
