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
import { useDeleteAllTools } from "@/hooks/useTools";

interface DeleteAllToolsDialogProps {
    openDeleteAllToolsDialog: boolean;
    setOpenDeleteAllToolsDialog: Dispatch<SetStateAction<boolean>>;
}

const DeleteAllToolsDialog = ({
    openDeleteAllToolsDialog,
    setOpenDeleteAllToolsDialog,
}: DeleteAllToolsDialogProps) => {
    const deleteAllTools = useDeleteAllTools();

    const handleDeleteAllTools = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        deleteAllTools.mutate(undefined, {
            onSuccess: () => {
                setOpenDeleteAllToolsDialog(false);
            },
        });
    };
    return (
        <Dialog
            open={openDeleteAllToolsDialog}
            onOpenChange={setOpenDeleteAllToolsDialog}
        >
            <DialogContent>
                <form onSubmit={handleDeleteAllTools}>
                    <DialogHeader>
                        <DialogTitle>Confirm Delete All Tools</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete all tools? This
                            action cannot be undone and will permanently remove
                            all tools and their associated data.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button>Close</Button>
                        </DialogClose>
                        <Button type="submit">Delete all tools</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default DeleteAllToolsDialog;
