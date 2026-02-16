import Html5QrcodePlugin, {
    type Html5QrcodePluginRef,
} from "@/components/Html5QrcodeScannerPlugin";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useUserTransactions } from "@/hooks/useTransactions";
import { useRef } from "react";
import { useLocation, useNavigate } from "react-router";
import { toast } from "sonner";
import { useScanForTransaction } from "@/hooks/useTransactions";
import NavUser from "@/components/NavUser";

const Dashboard = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const user = location.state?.user;
    const isProcessing = useRef(false);
    const scannerRef = useRef<Html5QrcodePluginRef>(null);
    const { data: userTransactions = [] } = useUserTransactions(user.id);
    const scanForTransaction = useScanForTransaction();

    const onNewScanResult = async (decodedText: string) => {
        if (isProcessing.current) return;
        isProcessing.current = true;

        // Optionally stop the scanner
        scannerRef.current?.stop();

        scanForTransaction.mutate({ userId: user.id, toolQrCode: decodedText });
    };

    const handleLogout = () => {
        toast.success("Logged out successfully.");
        navigate("/");
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
        <div className="container mx-auto p-4">
            <header className="border-b p-4">
                <div className="mx-auto flex max-w-7xl items-center justify-between">
                    <h1 className="text-xl font-bold">Tool Tracking System</h1>
                    <NavUser user={user} onLogout={handleLogout} />
                </div>
            </header>
            <div className="flex flex-col md:flex-row justify-evenly gap-4">
                <div>
                    <Html5QrcodePlugin
                        ref={scannerRef}
                        fps={10}
                        qrbox={250}
                        disableFlip={false}
                        qrCodeSuccessCallback={onNewScanResult}
                    />
                </div>
                <div className="flex flex-col gap-4 p-4">
                    <h2 className="text-xl font-semibold">Transactions</h2>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Quantity</TableHead>
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
                                                {userTransaction.tool.name}
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
                                        className="text-center text-gray-500"
                                    >
                                        No transactions found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
