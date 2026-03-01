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
import { useDeleteAllAssets } from "@/hooks/useAssets";
import { PackageX, Trash2, X } from "lucide-react";

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
            <DialogContent className="max-w-md w-[calc(100%-2rem)] max-h-[85svh] flex flex-col gap-0 p-0 overflow-hidden">
                <form
                    onSubmit={handleDeleteAllAssets}
                    className="flex flex-col gap-4 p-4 sm:p-6"
                >
                    <DialogHeader>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-destructive/10">
                                <PackageX className="w-5 h-5 text-destructive" />
                            </div>
                            <div>
                                <DialogTitle className="text-base sm:text-lg">
                                    Confirm Delete All Assets
                                </DialogTitle>
                                <DialogDescription className="text-xs sm:text-sm">
                                    This action cannot be undone and will
                                    permanently remove all assets and their
                                    associated data.
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    <Separator />

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
                            disabled={deleteAllAssets.isPending}
                        >
                            <Trash2 className="w-4 h-4" />
                            {deleteAllAssets.isPending
                                ? "Deleting..."
                                : "Delete all assets"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default DeleteAllAssetsDialog;
