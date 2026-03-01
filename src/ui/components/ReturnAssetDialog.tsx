import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useRef, useState, type Dispatch, type SetStateAction } from "react";
import QrScan from "./QrScan";
import { useReturnAsset } from "@/hooks/useTransactions";
import { toast } from "sonner";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Undo2, QrCode, ScanLine, X } from "lucide-react";

interface ReturnAssetDialogProps {
    user: User;
    openReturnDialog: boolean;
    setOpenReturnDialog: Dispatch<SetStateAction<boolean>>;
}

const ReturnAssetDialog = ({
    user,
    openReturnDialog,
    setOpenReturnDialog,
}: ReturnAssetDialogProps) => {
    const returnAsset = useReturnAsset();
    const isProcessing = useRef(false);
    const [returnCount, setReturnCount] = useState(1);
    const [code, setCode] = useState("");

    const handleScan = (code: string) => {
        if (isProcessing.current) return;
        isProcessing.current = true;
        setCode(code);
    };

    const handleCancel = () => {
        setCode("");
        setReturnCount(1);
        isProcessing.current = false;
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        returnAsset.mutate(
            { userId: user.id, assetQrCode: code, returnCount },
            {
                onSuccess: () => {
                    setOpenReturnDialog(false);
                    setCode("");
                    setReturnCount(1);
                    isProcessing.current = false;
                },
                onError: (error) => {
                    toast.error(
                        error.message ||
                            "Returning Asset failed. Please try again.",
                    );
                    isProcessing.current = false;
                },
            },
        );
    };
    return (
        <Dialog open={openReturnDialog} onOpenChange={setOpenReturnDialog}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                            <Undo2 className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <DialogTitle>Return Asset</DialogTitle>
                            <DialogDescription>
                                Scan Asset's QR Code to return
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
                            <Label htmlFor="return-count">
                                Quantity to Return
                            </Label>
                            <Input
                                id="return-count"
                                type="number"
                                min={1}
                                value={returnCount}
                                onChange={(e) =>
                                    setReturnCount(Number(e.target.value))
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
                                <Undo2 className="w-4 h-4 mr-1" />
                                Return Asset
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

export default ReturnAssetDialog;
