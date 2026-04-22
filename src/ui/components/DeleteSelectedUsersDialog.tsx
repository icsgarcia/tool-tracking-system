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
import { useDeleteSelectedUsers } from "@/hooks/useUsers";
import { UsersRound, Trash2, X } from "lucide-react";

interface DeleteSelectedUsersDialogProps {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    userIds: string[];
    currentUserId: string;
    onSuccess: () => void;
}

const DeleteSelectedUsersDialog = ({
    open,
    setOpen,
    userIds,
    currentUserId,
    onSuccess,
}: DeleteSelectedUsersDialogProps) => {
    const deleteSelectedUsers = useDeleteSelectedUsers();

    const handleDelete = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        deleteSelectedUsers.mutate(
            { userIds, currentUserId },
            {
                onSuccess: () => {
                    setOpen(false);
                    onSuccess();
                },
            },
        );
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-md w-[calc(100%-2rem)] max-h-[85svh] flex flex-col gap-0 p-0 overflow-hidden">
                <form
                    onSubmit={handleDelete}
                    className="flex flex-col gap-4 p-4 sm:p-6"
                >
                    <DialogHeader>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-destructive/10">
                                <UsersRound className="w-5 h-5 text-destructive" />
                            </div>
                            <div>
                                <DialogTitle className="text-base sm:text-lg">
                                    Delete Selected Users
                                </DialogTitle>
                                <DialogDescription className="text-xs sm:text-sm">
                                    This action cannot be undone and will
                                    permanently remove the selected users and
                                    their associated data.
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    <Separator />

                    <p className="text-sm text-muted-foreground">
                        You are about to delete{" "}
                        <span className="font-semibold text-foreground">
                            {userIds.length}
                        </span>{" "}
                        user(s). Are you sure you want to proceed?
                    </p>

                    <DialogFooter>
                        {/* <DialogClose asChild> */}
                        <DialogClose>
                            <Button variant="outline">
                                <X className="w-4 h-4" />
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button
                            type="submit"
                            variant="destructive"
                            disabled={deleteSelectedUsers.isPending}
                        >
                            <Trash2 className="w-4 h-4" />
                            {deleteSelectedUsers.isPending
                                ? "Deleting..."
                                : `Delete ${userIds.length} user(s)`}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default DeleteSelectedUsersDialog;
