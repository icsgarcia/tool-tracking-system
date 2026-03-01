import QrScan from "@/components/QrScan";
import { useScanUser } from "@/hooks/useUsers";
import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScanLine, ShieldAlert, AlertCircle } from "lucide-react";

const Login = () => {
    const [error, setError] = useState<string | null>(null);
    const [scanning, setScanning] = useState(true);
    const navigate = useNavigate();
    const isProcessing = useRef(false);
    const scanUser = useScanUser();

    const handleScan = (code: string) => {
        if (isProcessing.current) return;
        isProcessing.current = true;
        setError(null);

        scanUser.mutate(code, {
            onSuccess: (user) => {
                if (user.role !== "ADMIN") {
                    toast.error("Only ADMIN users can log in here.");
                    setError("Only ADMIN users can log in here.");
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

    return (
        <div className="flex min-h-svh flex-col items-center justify-center p-4 sm:p-6 bg-muted/30">
            <Card className="max-w-md w-full shadow-lg border-none">
                <CardContent className="flex flex-col items-center gap-5 sm:gap-6 p-6 sm:p-10">
                    <img
                        src="./toolkeeper-logos/logo3.png"
                        alt="tool-keeper-logo"
                        className="w-48 sm:w-64 lg:w-72 h-auto"
                    />

                    <Separator />

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

                    <div className="flex items-center gap-2 rounded-lg border p-3 bg-muted/50 w-full">
                        <ShieldAlert className="w-4 h-4 text-muted-foreground shrink-0" />
                        <p className="text-xs text-muted-foreground">
                            Admin access only. Student and staff login is
                            available after admin authentication.
                        </p>
                    </div>

                    {error && (
                        <div className="flex items-center gap-2 w-full rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3">
                            <AlertCircle className="w-4 h-4 text-destructive shrink-0" />
                            <p className="text-sm text-destructive">{error}</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {scanning && (
                <QrScan
                    handleScan={handleScan}
                    className="opacity-0 pointer-events-none absolute"
                />
            )}
        </div>
    );
};

export default Login;
