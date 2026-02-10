import Html5QrcodePlugin, {
    type Html5QrcodePluginRef,
} from "@/components/Html5QrcodeScannerPlugin";
import { useScanUser } from "@/hooks/useUsers";
import { useState, useRef } from "react";
import { useNavigate } from "react-router";

const Login = () => {
    const [error, setError] = useState<string | null>(null);
    const [scanning, setScanning] = useState(true);
    const navigate = useNavigate();
    const isProcessing = useRef(false);
    const scannerRef = useRef<Html5QrcodePluginRef>(null);
    const scanUser = useScanUser();

    const onNewScanResult = async (decodedText: string) => {
        if (isProcessing.current) return;
        isProcessing.current = true;
        setError(null);

        // Stop camera immediately
        scannerRef.current?.stop();

        scanUser.mutate(decodedText, {
            onSuccess: (user) => {
                setScanning(false);
                if (user.role === "ADMIN") {
                    navigate("/admin", { state: { user } });
                } else {
                    navigate("/dashboard", { state: { user } });
                }
            },
            onError: (err: any) => {
                setError(
                    err.response?.data?.message ||
                        "No user found with that QR code.",
                );
                isProcessing.current = false;
                setScanning(false);
                setTimeout(() => setScanning(true), 100);
            },
        });
    };

    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-4">
            <h1 className="text-2xl font-bold">Asset Tracking System</h1>
            <p className="text-gray-500">Scan your QR Code to login</p>

            {error && (
                <div className="rounded-md bg-red-100 px-4 py-3 text-red-700">
                    {error}
                </div>
            )}

            {scanning && (
                <div className="w-full max-w-md">
                    <Html5QrcodePlugin
                        ref={scannerRef}
                        fps={10}
                        qrbox={250}
                        disableFlip={false}
                        qrCodeSuccessCallback={onNewScanResult}
                    />
                </div>
            )}
        </div>
    );
};

export default Login;
