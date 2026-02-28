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
                    <DialogTitle>Student/Staff Login</DialogTitle>
                    <DialogDescription>
                        Scan Student's or Staff's QR Code to login
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col items-center gap-3 py-4">
                    <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Waiting for QR code scan...
                    </p>
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
