import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useGetUserTransactions } from "@/hooks/useTransactions";
import { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { toast } from "sonner";
import { useScanForTransaction } from "@/hooks/useTransactions";
import QrScan from "@/components/QrScan";
import ProfileCard from "@/components/ProfileCard";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Dashboard = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const user = location.state?.user;
    const admin = location.state?.admin;
    const isProcessing = useRef(false);
    const { data: userTransactions = [] } = useGetUserTransactions(user.id);
    const scanForTransaction = useScanForTransaction();
    const [error, setError] = useState<string | null>(null);

    const handleScan = (code: string) => {
        if (isProcessing.current) return;
        isProcessing.current = true;
        setError(null);

        scanForTransaction.mutate({ userId: user.id, assetQrCode: code });
    };

    const handleLogout = () => {
        if (admin) {
            toast.success("Logged out successfully.");

            navigate("/admin", { state: { user: admin } });
        } else {
            navigate("/");
        }
    };

    if (!user) {
        return (
            <div className="flex min-h-svh flex-col items-center justify-center gap-4">
                <p className="text-gray-500">
                    No user data. Please scan your QR code.
                </p>
                <button
                    className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                    onClick={() => navigate("/")}
                >
                    Go to Login
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto">
            <Header user={user} handleLogout={handleLogout} />

            <div className="flex flex-col gap-4 mt-4 mb-8">
                <ProfileCard user={user} />

                <Card>
                    <CardHeader>
                        <CardTitle>Transactions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Asset Name</TableHead>
                                    <TableHead>Borrowed Quantity</TableHead>
                                    <TableHead>Borrowed Date</TableHead>
                                    <TableHead>Returned Date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {userTransactions?.length > 0 ? (
                                    userTransactions.map((userTransaction) => {
                                        const borrowedDate =
                                            userTransaction.borrowedAt;
                                        const returnedDate =
                                            userTransaction.returnedAt;
                                        return (
                                            <TableRow>
                                                <TableCell>
                                                    {
                                                        userTransaction.asset
                                                            .assetName
                                                    }
                                                </TableCell>
                                                <TableCell>1</TableCell>
                                                <TableCell>
                                                    {new Date(
                                                        borrowedDate,
                                                    ).toLocaleString("en-US", {
                                                        year: "numeric",
                                                        month: "short",
                                                        day: "numeric",
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                                                </TableCell>
                                                <TableCell>
                                                    {returnedDate
                                                        ? new Date(
                                                              returnedDate,
                                                          ).toLocaleString(
                                                              "en-US",
                                                              {
                                                                  year: "numeric",
                                                                  month: "short",
                                                                  day: "numeric",
                                                                  hour: "2-digit",
                                                                  minute: "2-digit",
                                                              },
                                                          )
                                                        : ""}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={4}
                                            className="text-center text-gray-500 pt-6"
                                        >
                                            No transactions found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <div>
                    {error && (
                        <div className="rounded-md bg-red-100 px-4 py-3 text-red-700">
                            {error}
                        </div>
                    )}
                    <QrScan
                        handleScan={handleScan}
                        className="opacity-0 pointer-events-none absolute"
                    />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
