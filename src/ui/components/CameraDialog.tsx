import {
    useEffect,
    useRef,
    useState,
    type Dispatch,
    type SetStateAction,
} from "react";
import { Dialog, DialogContent } from "./ui/dialog";
import { useNavigate } from "react-router";
import { useScanUser } from "@/hooks/useUsers";
import { toast } from "sonner";
import { Html5Qrcode } from "html5-qrcode";
import { AlertCircle, Camera } from "lucide-react";
import { useAdminStore } from "@/store/useAdminStore";

interface CameraDialogProps {
    open: string;
    setOpen: Dispatch<SetStateAction<string | null>>;
}

const CameraDialog = ({ open, setOpen }: CameraDialogProps) => {
    const navigate = useNavigate();
    const scanUser = useScanUser();
    const admin = useAdminStore((state) => state.admin);
    const login = useAdminStore((state) => state.login);
    const isProcessing = useRef(false);
    const scannerRef = useRef<Html5Qrcode | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [cameraError, setCameraError] = useState<string | null>(null);

    const handleScan = useRef((code: string) => {
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
                    return;
                }

                login(user);

                toast.success(
                    `Login successful! Welcome, ${user.firstName} ${user.lastName}`,
                );

                // Stop scanner before navigating
                const scanner = scannerRef.current;
                if (scanner) {
                    scannerRef.current = null;
                    scanner
                        .stop()
                        .then(() => scanner.clear())
                        .catch(() => {});
                }

                if (admin) navigate("/admin");
            },
            onError: () => {
                toast.error("Login failed. Please check your QR code.");
                setError("Login failed. Please check your QR code.");
                isProcessing.current = false;
            },
        });
    });

    useEffect(() => {
        if (!open) return;

        const scannerId = "camera-qr-reader";
        let mounted = true;

        const startScanner = async () => {
            try {
                const scanner = new Html5Qrcode(scannerId);
                scannerRef.current = scanner;

                await scanner.start(
                    { facingMode: "environment" },
                    {
                        fps: 10,
                        qrbox: { width: 250, height: 250 },
                    },
                    (decodedText) => {
                        if (!mounted || isProcessing.current) return;
                        handleScan.current(decodedText);
                    },
                    () => {},
                );
            } catch (err) {
                if (mounted) {
                    setCameraError(
                        "Unable to access camera. Please check camera permissions.",
                    );
                }
                console.error("Camera error:", err);
            }
        };

        // Small delay to ensure the DOM element is rendered
        const timeout = setTimeout(startScanner, 100);

        return () => {
            mounted = false;
            clearTimeout(timeout);
            const scanner = scannerRef.current;
            if (scanner) {
                scannerRef.current = null;
                scanner
                    .stop()
                    .then(() => scanner.clear())
                    .catch(() => {});
            }
        };
    }, [open]);

    const handleCloseModal = async () => {
        setOpen(null);

        if (!open) {
            if (scannerRef.current) {
                try {
                    await scannerRef.current.stop();
                    scannerRef.current.clear();
                } catch (err) {
                    console.error("Error stopping camera scanner:", err);
                }
                scannerRef.current = null;
            }
        }
    };

    return (
        <Dialog open={open === "camera"} onOpenChange={handleCloseModal}>
            <DialogContent className="sm:max-w-md">
                <div className="flex flex-col items-center gap-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                        <Camera className="w-6 h-6 text-primary" />
                    </div>
                    <div className="text-center space-y-1">
                        <p className="text-sm sm:text-base font-medium">
                            Scan Admin QR Code
                        </p>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                            Position your QR code in front of the camera
                        </p>
                    </div>

                    {cameraError ? (
                        <div className="flex items-center gap-2 w-full rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3">
                            <AlertCircle className="w-4 h-4 text-destructive shrink-0" />
                            <p className="text-sm text-destructive">
                                {cameraError}
                            </p>
                        </div>
                    ) : (
                        <div className="w-full overflow-hidden rounded-lg">
                            <div id="camera-qr-reader" className="w-full" />
                        </div>
                    )}

                    {error && (
                        <div className="flex items-center gap-2 w-full rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3">
                            <AlertCircle className="w-4 h-4 text-destructive shrink-0" />
                            <p className="text-sm text-destructive">{error}</p>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default CameraDialog;
