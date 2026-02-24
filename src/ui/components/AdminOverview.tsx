import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "./ui/card";
import { useRef, useState } from "react";
import { useScanUser } from "@/hooks/useUsers";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import QrScan from "./QrScan";

interface AdminOverviewType {
    users: User[];
    assets: Asset[];
}

const AdminOverview = ({ users, assets }: AdminOverviewType) => {
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const [scanning, setScanning] = useState(true);
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
        <div>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 mb-4">
                <Card>
                    <CardHeader>
                        <CardDescription>Total Users</CardDescription>
                        <CardTitle className="text-3xl">
                            {users.length}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-gray-500">
                            {users.filter((u) => u.status === "ACTIVE").length}{" "}
                            active
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardDescription>Total Assets</CardDescription>
                        <CardTitle className="text-3xl">
                            {assets.length}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-gray-500">
                            {assets.reduce((sum, t) => sum + t.assetCount, 0)}{" "}
                            total quantity
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardDescription>Transactions</CardDescription>
                        <CardTitle className="text-3xl">0</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-gray-500">0 pending</p>
                    </CardContent>
                </Card>
            </div>
            {error && (
                <div className="rounded-md bg-red-100 px-4 py-3 text-red-700">
                    {error}
                </div>
            )}
            <div>{scanning && <QrScan handleScan={handleScan} />}</div>
        </div>
    );
};

export default AdminOverview;
