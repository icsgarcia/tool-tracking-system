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
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-4">
            <h1 className="text-2xl font-bold">ASSET KEEPER</h1>
            <p className="text-gray-500">Scan your QR/Barcode to login</p>

            {error && (
                <div className="rounded-md bg-red-100 px-4 py-3 text-red-700">
                    {error}
                </div>
            )}

            {scanning && <QrScan handleScan={handleScan} />}
        </div>
    );
};

export default Login;
