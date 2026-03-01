import type { Dispatch, FormEvent, SetStateAction } from "react";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { useDeleteAsset } from "@/hooks/useAssets";
import { PackageX, Trash2, X } from "lucide-react";

interface DeleteAssetDialogProps {
    openDeleteAsset: boolean;
    setOpenDeleteAsset: Dispatch<SetStateAction<boolean>>;
    asset: Asset;
}

const DeleteAssetDialog = ({
    openDeleteAsset,
    setOpenDeleteAsset,
    asset,
}: DeleteAssetDialogProps) => {
    const deleteAsset = useDeleteAsset();

    const handleDeleteAsset = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        deleteAsset.mutate(asset.id, {
            onSuccess: () => setOpenDeleteAsset(false),
        });
    };

    return (
        <Dialog open={openDeleteAsset} onOpenChange={setOpenDeleteAsset}>
            <DialogContent className="max-w-md w-[calc(100%-2rem)] max-h-[85svh] flex flex-col gap-0 p-0 overflow-hidden">
                <form
                    onSubmit={handleDeleteAsset}
                    className="flex flex-col gap-4 p-4 sm:p-6"
                >
                    <DialogHeader>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-destructive/10">
                                <PackageX className="w-5 h-5 text-destructive" />
                            </div>
                            <div>
                                <DialogTitle className="text-base sm:text-lg">
                                    Confirm Asset Deletion
                                </DialogTitle>
                                <DialogDescription className="text-xs sm:text-sm">
                                    This action cannot be undone and will
                                    permanently remove the asset and all
                                    associated data.
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    <Separator />

                    <div className="space-y-1 rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-sm">
                        <p>
                            <span className="font-bold">
                                Temporary Tag Number:
                            </span>{" "}
                            {asset.temporaryTagNumber}
                        </p>
                        <p>
                            <span className="font-bold">Asset Name:</span>{" "}
                            {asset.assetName}
                        </p>
                        <p>
                            <span className="font-bold">
                                Asset Description:
                            </span>{" "}
                            {asset.assetDescription}
                        </p>
                        <p>
                            <span className="font-bold">Quantity:</span>{" "}
                            {asset.assetCount}
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
                            disabled={deleteAsset.isPending}
                        >
                            <Trash2 className="w-4 h-4" />
                            {deleteAsset.isPending
                                ? "Deleting..."
                                : "Delete Asset"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default DeleteAssetDialog;
