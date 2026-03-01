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
import { useDeleteAllUsers } from "@/hooks/useUsers";
import { UsersRound, Trash2, X, Info } from "lucide-react";

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
                <form
                    onSubmit={handleDeleteAllUsers}
                    className="flex flex-col gap-4 p-4 sm:p-6"
                >
                    <DialogHeader>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-destructive/10">
                                <UsersRound className="w-5 h-5 text-destructive" />
                            </div>
                            <div>
                                <DialogTitle className="text-base sm:text-lg">
                                    Confirm Delete All Users
                                </DialogTitle>
                                <DialogDescription className="text-xs sm:text-sm">
                                    This action cannot be undone and will
                                    permanently remove all users and their
                                    associated data.
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    <Separator />

                    <div className="flex items-start gap-2 rounded-lg border p-3 text-xs sm:text-sm bg-muted/50">
                        <Info className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                        <span>
                            <span className="font-bold">Note:</span> The
                            currently logged in user will not be deleted and
                            will be the only remaining user in the system.
                        </span>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">
                                <X className="w-4 h-4" />
                                Close
                            </Button>
                        </DialogClose>
                        <Button
                            type="submit"
                            variant="destructive"
                            disabled={deleteAllUsers.isPending}
                        >
                            <Trash2 className="w-4 h-4" />
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
