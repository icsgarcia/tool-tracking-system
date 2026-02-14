import Html5QrcodePlugin, {
    type Html5QrcodePluginRef,
} from "@/components/Html5QrcodeScannerPlugin";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useUserTransactions } from "@/hooks/useTransactions";
import type { UserTransactions } from "@/types/userTransactions";
import { Hash, LogOut, Mail } from "lucide-react";
import { useRef } from "react";
import { useLocation, useNavigate } from "react-router";
import { toast } from "sonner";

const Dashboard = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const user = location.state?.user;
    const isProcessing = useRef(false);
    const scannerRef = useRef<Html5QrcodePluginRef>(null);
    const { data: userTransactions = [] } = useUserTransactions(user.id);

    const onNewScanResult = async (decodedText: string) => {};

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
        <div className="min-h-svh container mx-auto p-4">
            <div className="relative w-full rounded-lg border p-6 shadow mb-6">
                <div>
                    <p className="text-lg font-semibold">
                        {user.firstName} {user.middleName} {user.lastName}
                    </p>
                    <p className="text-sm italic">{user.schoolNumber}</p>
                    <p>{user.department}</p>
                    <p>
                        <span className="font-semibold">Year</span>{" "}
                        {user.yearLevel}
                    </p>
                    <div className="flex gap-8">
                        <div className="flex gap-1">
                            <Mail />
                            <p>{user.email}</p>
                        </div>

                        {user.number && (
                            <div className="flex gap-1">
                                <Hash />
                                <p>{user.number}</p>
                            </div>
                        )}
                    </div>

                    <Button
                        onClick={() => {
                            toast.success("Logged out successfully.");
                            navigate("/");
                        }}
                        className=" absolute top-2 right-2 rounded bg-red-400 hover:bg-red-500"
                    >
                        <LogOut /> Logout
                    </Button>
                </div>
            </div>
            <div className="flex justify-evenly gap-4">
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
                                userTransactions.map((userTransaction) => (
                                    <TableRow>
                                        <TableCell>
                                            {userTransaction.tool.name}
                                        </TableCell>
                                        <TableCell>1</TableCell>
                                        <TableCell>
                                            {userTransaction.borrowedAt}
                                        </TableCell>
                                        <TableCell>
                                            {userTransaction.returnedAt}
                                        </TableCell>
                                    </TableRow>
                                ))
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
