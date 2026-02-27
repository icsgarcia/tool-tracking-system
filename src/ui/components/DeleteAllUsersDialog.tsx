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
import { useDeleteAllUsers } from "@/hooks/useUsers";

interface DeleteAllUsersDialogProps {
    openDeleteAllUsersDialog: boolean;
    setOpenDeleteAllUsersDialog: Dispatch<SetStateAction<boolean>>;
    userId: string;
}

const DeleteAllUsersDialog = ({
    openDeleteAllUsersDialog,
    setOpenDeleteAllUsersDialog,
    userId,
}: DeleteAllUsersDialogProps) => {
    const deleteAllUsers = useDeleteAllUsers();

    const handleDeleteAllUsers = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        deleteAllUsers.mutate(userId, {
            onSuccess: () => {
                setOpenDeleteAllUsersDialog(false);
            },
        });
    };
    return (
        <Dialog
            open={openDeleteAllUsersDialog}
            onOpenChange={setOpenDeleteAllUsersDialog}
        >
            <DialogContent className="max-w-md w-[calc(100%-2rem)] max-h-[85svh] flex flex-col gap-0 p-0 overflow-hidden">
                <form onSubmit={handleDeleteAllUsers} className="flex flex-col gap-4 p-4 sm:p-6">
                    <DialogHeader>
                        <DialogTitle className="text-base sm:text-lg">
                            Confirm Delete All Users
                        </DialogTitle>
                        <DialogDescription className="text-xs sm:text-sm">
                            Are you sure you want to delete all users? This
                            action cannot be undone and will permanently
                            remove all users and their associated data.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="rounded-md border p-3 text-xs sm:text-sm">
                        <span className="font-bold">Note:</span> The currently
                        logged in user will not be deleted and will be the only
                        remaining user in the system.
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button>Close</Button>
                        </DialogClose>
                        <Button type="submit" disabled={deleteAllUsers.isPending}>
                            {deleteAllUsers.isPending
                                ? "Deleting..."
                                : "Delete all users"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default DeleteAllUsersDialog;
