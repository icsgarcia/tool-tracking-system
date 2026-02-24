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
                setScanning(false);
                toast.success(
                    `Login successful! Welcome, ${user.firstName} ${user.lastName}`,
                );
                if (user.role === "ADMIN") {
                    navigate("/admin", { state: { user } });
                } else {
                    navigate("/dashboard", { state: { user } });
                }
            },
            onError: () => {
                toast.error("Login failed. Please check your QR/barcode.");
                setError("Login failed. Please check your QR/barcode.");
                isProcessing.current = false;
                setScanning(false);
                setTimeout(() => setScanning(true), 100);
            },
        });
    };

    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-4 p-4">
            <img
                src="/logo3.png"
                alt="tool-keeper-logo"
                className="w-75 lg:w-120"
            />
            <div className="flex flex-col items-center justify-center">
                <p className="text-gray-400 font-medium lg:text-xl">
                    Scan your Admin QR code to login
                </p>

                {error && (
                    <div className="rounded-md bg-red-100 px-4 py-3 text-red-700 mt-2">
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
