import type { Dispatch, SetStateAction } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import {
    Package,
    Hash,
    FileText,
    MapPin,
    Layers,
    PackageCheck,
    PackageX,
    PackageOpen,
    ShieldCheck,
    MessageSquareText,
} from "lucide-react";

interface AssetDetailDialogProps {
    openAssetDetailDialog: boolean;
    setOpenAssetDetailDialog: Dispatch<SetStateAction<boolean>>;
    asset: Asset;
}

const AssetDetailDialog = ({
    openAssetDetailDialog,
    setOpenAssetDetailDialog,
    asset,
}: AssetDetailDialogProps) => {
    return (
        <Dialog
            open={openAssetDetailDialog}
            onOpenChange={setOpenAssetDetailDialog}
        >
            <DialogContent className="max-w-md w-[calc(100%-2rem)] max-h-[85svh] flex flex-col gap-0 p-0 overflow-hidden">
                <DialogHeader className="shrink-0 px-4 pt-4 pb-2 sm:px-6 sm:pt-6">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                            <Package className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <DialogTitle className="text-base sm:text-lg">
                                Asset Details
                            </DialogTitle>
                            <DialogDescription className="text-xs sm:text-sm">
                                {asset.assetName}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <Separator className="mx-4 sm:mx-6 w-auto" />

                <div className="flex-1 overflow-y-auto overscroll-contain px-4 pb-4 sm:px-6 sm:pb-6 pt-2">
                    <div className="space-y-3">
                        <div className="flex items-center justify-center">
                            <img
                                src={asset.qrCodeImage}
                                alt={asset.assetName}
                                className="w-28 h-28 rounded-md border"
                            />
                        </div>

                        {asset.temporaryTagNumber && (
                            <div className="flex items-center gap-3 rounded-lg border p-3 bg-muted/50">
                                <Hash className="w-5 h-5 text-muted-foreground shrink-0" />
                                <div className="min-w-0">
                                    <p className="text-xs text-muted-foreground">
                                        Tag Number
                                    </p>
                                    <p className="text-sm font-medium truncate">
                                        {asset.temporaryTagNumber}
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="flex items-center gap-3 rounded-lg border p-3 bg-muted/50">
                            <Package className="w-5 h-5 text-muted-foreground shrink-0" />
                            <div className="min-w-0">
                                <p className="text-xs text-muted-foreground">
                                    Asset Name
                                </p>
                                <p className="text-sm font-medium truncate">
                                    {asset.assetName}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 rounded-lg border p-3 bg-muted/50">
                            <FileText className="w-5 h-5 text-muted-foreground shrink-0" />
                            <div className="min-w-0">
                                <p className="text-xs text-muted-foreground">
                                    Description
                                </p>
                                <p className="text-sm font-medium">
                                    {asset.assetDescription || "—"}
                                </p>
                            </div>
                        </div>

                        {asset.serialNumber && (
                            <div className="flex items-center gap-3 rounded-lg border p-3 bg-muted/50">
                                <Layers className="w-5 h-5 text-muted-foreground shrink-0" />
                                <div className="min-w-0">
                                    <p className="text-xs text-muted-foreground">
                                        Serial Number
                                    </p>
                                    <p className="text-sm font-medium truncate">
                                        {asset.serialNumber}
                                    </p>
                                </div>
                            </div>
                        )}

                        {asset.assetCategoryCode && (
                            <div className="flex items-center gap-3 rounded-lg border p-3 bg-muted/50">
                                <Layers className="w-5 h-5 text-muted-foreground shrink-0" />
                                <div className="min-w-0">
                                    <p className="text-xs text-muted-foreground">
                                        Category Code
                                    </p>
                                    <p className="text-sm font-medium truncate">
                                        {asset.assetCategoryCode}
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-3">
                            {asset.roomName && (
                                <div className="flex items-center gap-3 rounded-lg border p-3 bg-muted/50">
                                    <MapPin className="w-5 h-5 text-muted-foreground shrink-0" />
                                    <div className="min-w-0">
                                        <p className="text-xs text-muted-foreground">
                                            Room
                                        </p>
                                        <p className="text-sm font-medium truncate">
                                            {asset.roomName}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {asset.locationCode && (
                                <div className="flex items-center gap-3 rounded-lg border p-3 bg-muted/50">
                                    <MapPin className="w-5 h-5 text-muted-foreground shrink-0" />
                                    <div className="min-w-0">
                                        <p className="text-xs text-muted-foreground">
                                            Location Code
                                        </p>
                                        <p className="text-sm font-medium truncate">
                                            {asset.locationCode}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            <div className="flex items-center gap-3 rounded-lg border p-3 bg-muted/50">
                                <PackageCheck className="w-5 h-5 text-muted-foreground shrink-0" />
                                <div className="min-w-0">
                                    <p className="text-xs text-muted-foreground">
                                        Total Qty
                                    </p>
                                    <p className="text-sm font-medium">
                                        {asset.assetCount}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 rounded-lg border p-3 bg-muted/50">
                                <PackageX className="w-5 h-5 text-muted-foreground shrink-0" />
                                <div className="min-w-0">
                                    <p className="text-xs text-muted-foreground">
                                        Checked Out
                                    </p>
                                    <p className="text-sm font-medium">
                                        {asset.borrowedCount}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 rounded-lg border p-3 bg-muted/50">
                                <PackageOpen className="w-5 h-5 text-muted-foreground shrink-0" />
                                <div className="min-w-0">
                                    <p className="text-xs text-muted-foreground">
                                        Available
                                    </p>
                                    <p className="text-sm font-medium">
                                        {asset.availableCount}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {asset.assetCondition && (
                            <div className="flex items-center gap-3 rounded-lg border p-3 bg-muted/50">
                                <ShieldCheck className="w-5 h-5 text-muted-foreground shrink-0" />
                                <div className="min-w-0">
                                    <p className="text-xs text-muted-foreground">
                                        Condition
                                    </p>
                                    <Badge variant="outline" className="mt-1">
                                        {asset.assetCondition}
                                    </Badge>
                                </div>
                            </div>
                        )}

                        {asset.remarks && (
                            <div className="flex items-center gap-3 rounded-lg border p-3 bg-muted/50">
                                <MessageSquareText className="w-5 h-5 text-muted-foreground shrink-0" />
                                <div className="min-w-0">
                                    <p className="text-xs text-muted-foreground">
                                        Remarks
                                    </p>
                                    <p className="text-sm font-medium">
                                        {asset.remarks}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default AssetDetailDialog;
