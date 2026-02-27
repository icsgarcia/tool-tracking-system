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
        <div className="flex min-h-svh flex-col items-center justify-center gap-4 sm:gap-6 p-4 sm:p-6">
            <img
                src="/logo3.png"
                alt="tool-keeper-logo"
                className="w-48 sm:w-64 lg:w-80 h-auto"
            />
            <div className="flex flex-col items-center justify-center max-w-md w-full text-center">
                <p className="text-sm sm:text-base lg:text-xl text-gray-400 font-medium px-2">
                    Scan your Admin QR code to login
                </p>

                {error && (
                    <div className="w-full rounded-md bg-red-100 px-4 py-3 text-sm sm:text-base text-red-700 mt-3">
                        {error}
                    </div>
                )}

                {scanning && (
                    <QrScan
                        handleScan={handleScan}
                        className="opacity-0 pointer-events-none absolute"
                    />
                )}
            </div>
        </div>
    );
};

export default Login;
