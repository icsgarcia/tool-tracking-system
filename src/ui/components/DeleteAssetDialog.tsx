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
import { useDeleteAsset } from "@/hooks/useAssets";

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
            <DialogContent>
                <form onSubmit={handleDeleteAsset}>
                    <DialogHeader>
                        <DialogTitle>Confirm Asset Deletion</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this asset? This
                            action cannot be undone and will permanently remove
                            the asset and all associated data.
                        </DialogDescription>
                    </DialogHeader>
                    <div>
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
                            <Button>Cancel</Button>
                        </DialogClose>
                        <Button type="submit" disabled={deleteAsset.isPending}>
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
