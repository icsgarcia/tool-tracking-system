import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    useEffect,
    useRef,
    useState,
    type Dispatch,
    type SetStateAction,
} from "react";
import QrScan from "./QrScan";
import { useNavigate } from "react-router";
import { useScanUser } from "@/hooks/useUsers";
import { toast } from "sonner";
import { Separator } from "./ui/separator";
import { LogIn, ScanLine } from "lucide-react";

interface LoginDialogProps {
    admin: User;
    openLoginDialog: boolean;
    setOpenLoginDialog: Dispatch<SetStateAction<boolean>>;
}

const LoginDialog = ({
    admin,
    openLoginDialog,
    setOpenLoginDialog,
}: LoginDialogProps) => {
    const navigate = useNavigate();
    const scanUser = useScanUser();
    const isProcessing = useRef(false);
    const [scanningUser, setScanningUser] = useState(true);

    useEffect(() => {
        if (openLoginDialog) {
            isProcessing.current = false;
            setScanningUser(true);
        }
    }, [openLoginDialog]);

    const handleScanUser = (code: string) => {
        if (isProcessing.current) return;
        isProcessing.current = true;

        scanUser.mutate(code, {
            onSuccess: (user) => {
                if (user.role !== "STUDENT" && user.role !== "STAFF") {
                    toast.error(
                        "Only STUDENT or STAFF users can be scanned here.",
                    );
                    isProcessing.current = false;
                    return;
                }

                setScanningUser(false);

                toast.success(
                    `Login successful! Welcome, ${user.firstName} ${user.lastName}`,
                );

                navigate("/dashboard", { state: { user, admin } });
            },
            onError: () => {
                toast.error("Login failed. Please check your QR/barcode.");
                isProcessing.current = false;
                setScanningUser(false);
                setTimeout(() => setScanningUser(true), 100);
            },
        });
    };

    return (
        <Dialog open={openLoginDialog} onOpenChange={setOpenLoginDialog}>
            <DialogContent>
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                            <LogIn className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <DialogTitle>Student/Staff Login</DialogTitle>
                            <DialogDescription>
                                Scan Student's or Staff's QR Code to login
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <Separator />

                <div className="flex flex-col items-center gap-4 py-6">
                    <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-primary/10">
                        <ScanLine className="w-9 h-9 text-primary animate-pulse" />
                    </div>
                    <div className="text-center space-y-1">
                        <p className="text-sm font-medium">
                            Waiting for QR code scan...
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Place the student's or staff's QR code in front of
                            the scanner
                        </p>
                    </div>
                </div>
                {scanningUser && (
                    <QrScan
                        handleScan={handleScanUser}
                        className="opacity-0 pointer-events-none absolute"
                    />
                )}
            </DialogContent>
        </Dialog>
    );
};

export default LoginDialog;
