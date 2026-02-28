import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useRef, useState, type Dispatch, type SetStateAction } from "react";
import QrScan from "./QrScan";
import { useBorrowAsset } from "@/hooks/useTransactions";
import { toast } from "sonner";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

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
            <DialogContent>
                {code ? (
                    <div>
                        <form onSubmit={handleSubmit}>
                            <Input
                                type="number"
                                min={1}
                                value={borrowCount}
                                onChange={(e) =>
                                    setBorrowCount(Number(e.target.value))
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
                                <Button type="submit">Borrow Asset</Button>
                            </div>
                        </form>
                    </div>
                ) : (
                    <div>
                        <div>Scan Asset's QR Code to borrow</div>
                        <QrScan handleScan={handleScan} />
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default BorrowAssetDialog;
