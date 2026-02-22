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
            <DialogContent>
                <form onSubmit={handleDeleteAllUsers}>
                    <DialogHeader>
                        <DialogTitle>Confirm Delete All Users</DialogTitle>
                        <DialogDescription>
                            <p>
                                Are you sure you want to delete all users? This
                                action cannot be undone and will permanently
                                remove all users and their associated data.
                            </p>
                            <br />
                            <p>
                                <strong>Note:</strong> The currently logged in
                                user will not be deleted and will be the only
                                remaining user in the system.
                            </p>
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button>Close</Button>
                        </DialogClose>
                        <Button type="submit">Delete all users</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default DeleteAllUsersDialog;
