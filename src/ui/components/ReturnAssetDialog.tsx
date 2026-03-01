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
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Borrow Asset</DialogTitle>
                    <DialogDescription>
                        Scan Asset's QR Code to borrow
                    </DialogDescription>
                </DialogHeader>
                {code ? (
                    <div>
                        <form onSubmit={handleSubmit}>
                            <Input
                                type="number"
                                min={1}
                                value={returnCount}
                                onChange={(e) =>
                                    setReturnCount(Number(e.target.value))
                                }
                            />
                            <div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleCancel}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit">Return Asset</Button>
                            </div>
                        </form>
                    </div>
                ) : (
                    <>
                        <div className="flex flex-col items-center gap-3 py-4">
                            <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Waiting for QR code scan...
                            </p>
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
