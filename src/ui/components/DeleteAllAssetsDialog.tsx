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
import { useDeleteAllAssets } from "@/hooks/useAssets";

interface DeleteAllAssetsDialogProps {
    openDeleteAllAssetsDialog: boolean;
    setOpenDeleteAllAssetsDialog: Dispatch<SetStateAction<boolean>>;
}

const DeleteAllAssetsDialog = ({
    openDeleteAllAssetsDialog,
    setOpenDeleteAllAssetsDialog,
}: DeleteAllAssetsDialogProps) => {
    const deleteAllAssets = useDeleteAllAssets();

    const handleDeleteAllAssets = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        deleteAllAssets.mutate(undefined, {
            onSuccess: () => {
                setOpenDeleteAllAssetsDialog(false);
            },
        });
    };
    return (
        <Dialog
            open={openDeleteAllAssetsDialog}
            onOpenChange={setOpenDeleteAllAssetsDialog}
        >
            <DialogContent>
                <form onSubmit={handleDeleteAllAssets}>
                    <DialogHeader>
                        <DialogTitle>Confirm Delete All Assets</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete all assets? This
                            action cannot be undone and will permanently remove
                            all assets and their associated data.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button>Close</Button>
                        </DialogClose>
                        <Button type="submit">Delete all assets</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default DeleteAllAssetsDialog;
