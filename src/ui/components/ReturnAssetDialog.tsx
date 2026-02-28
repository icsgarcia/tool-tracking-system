import { Dialog, DialogContent } from "@/components/ui/dialog";
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
                    <div>
                        <div>Scan Asset's QR Code to return</div>
                        <QrScan handleScan={handleScan} />
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default ReturnAssetDialog;
