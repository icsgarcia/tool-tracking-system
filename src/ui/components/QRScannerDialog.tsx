import { AlertCircle, ScanLine } from "lucide-react";
import QrScan from "./QrScan";
import { useNavigate } from "react-router";
import { useRef, useState, type Dispatch, type SetStateAction } from "react";
import { useScanUser } from "@/hooks/useUsers";
import { toast } from "sonner";
import { Dialog, DialogContent } from "./ui/dialog";

interface QRScannerDialogProps {
    open: string;
    setOpen: Dispatch<SetStateAction<string | null>>;
}

const QRScannerDialog = ({ open, setOpen }: QRScannerDialogProps) => {
    const navigate = useNavigate();
    const isProcessing = useRef(false);
    const scanUser = useScanUser();
    const [scanning, setScanning] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const handleScan = (code: string) => {
        if (isProcessing.current) return;
        isProcessing.current = true;
        setError(null);

        scanUser.mutate(code, {
            onSuccess: (user) => {
                if (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
                    toast.error(
                        "Only ADMIN and SUPER_ADMIN users can log in here.",
                    );
                    setError(
                        "Only ADMIN and SUPER_ADMIN users can log in here.",
                    );
                    isProcessing.current = false;
                    setScanning(false);
                    setTimeout(() => setScanning(true), 100);
                    return;
                }

                setScanning(false);
                toast.success(
                    `Login successful! Welcome, ${user.firstName} ${user.lastName}`,
                );

                navigate("/admin", { state: { user } });
            },
            onError: () => {
                toast.error("Login failed. Please check your QR code.");
                setError("Login failed. Please check your QR code.");
                isProcessing.current = false;
                setScanning(false);
                setTimeout(() => setScanning(true), 100);
            },
        });
    };

    const handleCloseModal = () => {
        setOpen(null);
    };
    return (
        <Dialog open={open === "qr"} onOpenChange={handleCloseModal}>
            <DialogContent>
                <div>
                    <div className="flex flex-col items-center gap-3">
                        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                            <ScanLine className="w-8 h-8 text-primary animate-pulse" />
                        </div>
                        <div className="text-center space-y-1">
                            <p className="text-sm sm:text-base font-medium">
                                Waiting for QR code scan...
                            </p>
                            <p className="text-xs sm:text-sm text-muted-foreground px-2">
                                Scan your Admin QR code to login
                            </p>
                        </div>
                    </div>

                    {error && (
                        <div className="flex items-center gap-2 w-full rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3">
                            <AlertCircle className="w-4 h-4 text-destructive shrink-0" />
                            <p className="text-sm text-destructive">{error}</p>
                        </div>
                    )}

                    {scanning && (
                        <QrScan
                            handleScan={handleScan}
                            className="opacity-0 pointer-events-none absolute"
                        />
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default QRScannerDialog;
