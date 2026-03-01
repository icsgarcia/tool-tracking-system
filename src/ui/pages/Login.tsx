import QrScan from "@/components/QrScan";
import { useScanUser } from "@/hooks/useUsers";
import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

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
        <div className="flex min-h-svh flex-col items-center justify-center p-4 sm:p-6">
            <div className="flex flex-col items-center gap-4 sm:gap-6 bg-card rounded-2xl shadow-lg p-6 sm:p-10 max-w-md w-full">
                <div className="h-1.5 w-16 rounded-full bg-primary" />
                <img
                    src="./toolkeeper-logos/logo3.png"
                    alt="tool-keeper-logo"
                    className="w-48 sm:w-64 lg:w-72 h-auto"
                />
                <p className="text-sm sm:text-base lg:text-lg text-muted-foreground font-medium text-center px-2">
                    Scan your Admin QR code to login
                </p>

                {error && (
                    <div className="w-full rounded-md bg-destructive/10 px-4 py-3 text-sm sm:text-base text-destructive text-center">
                        {error}
                    </div>
                )}
            </div>

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
