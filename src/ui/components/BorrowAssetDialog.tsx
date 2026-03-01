import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useRef, useState, type Dispatch, type SetStateAction } from "react";
import QrScan from "./QrScan";
import { useBorrowAsset } from "@/hooks/useTransactions";
import { toast } from "sonner";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Package, QrCode, ScanLine, X } from "lucide-react";

interface BorrowAssetDialogProps {
    user: User;
    openBorrowDialog: boolean;
    setOpenBorrowDialog: Dispatch<SetStateAction<boolean>>;
}

const BorrowAssetDialog = ({
    user,
    openBorrowDialog,
    setOpenBorrowDialog,
}: BorrowAssetDialogProps) => {
    const borrowAsset = useBorrowAsset();
    const isProcessing = useRef(false);
    const [borrowCount, setBorrowCount] = useState(1);
    const [code, setCode] = useState("");

    const handleScan = (code: string) => {
        if (isProcessing.current) return;
        isProcessing.current = true;
        setCode(code);
    };

    const handleCancel = () => {
        setCode("");
        setBorrowCount(1);
        isProcessing.current = false;
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        borrowAsset.mutate(
            { userId: user.id, assetQrCode: code, borrowCount },
            {
                onSuccess: () => {
                    setOpenBorrowDialog(false);
                    setCode("");
                    setBorrowCount(1);
                    isProcessing.current = false;
                },
                onError: (error) => {
                    toast.error(
                        error.message ||
                            "Borrowing Asset failed. Please try again.",
                    );
                    isProcessing.current = false;
                },
            },
        );
    };

    return (
        <Dialog open={openBorrowDialog} onOpenChange={setOpenBorrowDialog}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                            <Package className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <DialogTitle>Borrow Asset</DialogTitle>
                            <DialogDescription>
                                Scan Asset's QR Code to borrow
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <Separator />

                {code ? (
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="flex items-center gap-3 rounded-lg border p-3 bg-muted/50">
                            <QrCode className="w-5 h-5 text-muted-foreground shrink-0" />
                            <div className="min-w-0">
                                <p className="text-xs text-muted-foreground">
                                    Scanned QR Code
                                </p>
                                <p className="text-sm font-medium truncate">
                                    {code}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="borrow-count">
                                Quantity to Borrow
                            </Label>
                            <Input
                                id="borrow-count"
                                type="number"
                                min={1}
                                value={borrowCount}
                                onChange={(e) =>
                                    setBorrowCount(Number(e.target.value))
                                }
                            />
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleCancel}
                            >
                                <X className="w-4 h-4 mr-1" />
                                Cancel
                            </Button>
                            <Button type="submit">
                                <Package className="w-4 h-4 mr-1" />
                                Borrow Asset
                            </Button>
                        </div>
                    </form>
                ) : (
                    <>
                        <div className="flex flex-col items-center gap-4 py-8">
                            <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-primary/10">
                                <ScanLine className="w-9 h-9 text-primary animate-pulse" />
                            </div>
                            <div className="text-center space-y-1">
                                <p className="text-sm font-medium">
                                    Waiting for QR code scan...
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Place the asset's QR code in front of the
                                    scanner
                                </p>
                            </div>
                        </div>

                        <QrScan
                            handleScan={handleScan}
                            className="opacity-0 pointer-events-none absolute"
                        />
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default BorrowAssetDialog;
