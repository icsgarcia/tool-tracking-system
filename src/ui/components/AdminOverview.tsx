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
import ProfileCard from "./ProfileCard";

interface AdminOverviewType {
    admin: User;
    users: User[];
    assets: Asset[];
}

const AdminOverview = ({ admin, users, assets }: AdminOverviewType) => {
    const navigate = useNavigate();
    const scanUser = useScanUser();
    const isProcessing = useRef(false);
    const [error, setError] = useState<string | null>(null);
    const [scanningUser, setScanningUser] = useState(true);

    const handleScanUser = (code: string) => {
        if (isProcessing.current) return;
        isProcessing.current = true;
        setError(null);

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
                setError("Login failed. Please check your QR/barcode.");
                isProcessing.current = false;
                setScanningUser(false);
                setTimeout(() => setScanningUser(true), 100);
            },
        });
    };

    return (
        <div className="flex flex-col gap-4 mt-4 mb-8">
            <ProfileCard user={admin} />

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 sm:gap-4 mb-4">
                <Card className="border-l-4 border-l-primary">
                    <CardHeader className="p-4 sm:p-6">
                        <CardDescription className="text-xs sm:text-sm">
                            Total Users
                        </CardDescription>
                        <CardTitle className="text-2xl sm:text-3xl text-primary">
                            {users.length}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6 pt-0">
                        <p className="text-xs text-muted-foreground">
                            {users.filter((u) => u.status === "ACTIVE").length}{" "}
                            active
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-primary/70">
                    <CardHeader className="p-4 sm:p-6">
                        <CardDescription className="text-xs sm:text-sm">
                            Total Assets
                        </CardDescription>
                        <CardTitle className="text-2xl sm:text-3xl text-primary">
                            {assets.length}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6 pt-0">
                        <p className="text-xs text-muted-foreground">
                            {assets.reduce((sum, t) => sum + t.assetCount, 0)}{" "}
                            total quantity
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-primary/50">
                    <CardHeader className="p-4 sm:p-6">
                        <CardDescription className="text-xs sm:text-sm">
                            Transactions
                        </CardDescription>
                        <CardTitle className="text-2xl sm:text-3xl text-primary">
                            0
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6 pt-0">
                        <p className="text-xs text-muted-foreground">0 pending</p>
                    </CardContent>
                </Card>
            </div>

            {error && (
                <div className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    {error}
                </div>
            )}
            {scanningUser && (
                <QrScan
                    handleScan={handleScanUser}
                    className="opacity-0 pointer-events-none absolute"
                />
            )}
        </div>
    );
};

export default AdminOverview;
