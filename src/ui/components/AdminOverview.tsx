import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "./ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "./ui/table";
import type { Tool, User } from "@/pages/AdminDashboard";
import Html5QrcodePlugin, {
    type Html5QrcodePluginRef,
} from "./Html5QrcodeScannerPlugin";
import { useRef } from "react";
import {
    useScanForTransaction,
    useGetUserTransactions,
} from "@/hooks/useTransactions";

interface AdminOverviewType {
    admin: User;
    users: User[];
    tools: Tool[];
}

const AdminOverview = ({ admin, users, tools }: AdminOverviewType) => {
    const scannerRef = useRef<Html5QrcodePluginRef>(null);
    const isProcessing = useRef(false);
    const { data: userTransactions = [] } = useGetUserTransactions(admin.id);
    const scanForTransaction = useScanForTransaction();

    const onNewScanResult = async (decodedText: string) => {
        if (isProcessing.current) return;
        isProcessing.current = true;

        // Optionally stop the scanner
        scannerRef.current?.stop();

        scanForTransaction.mutate({
            userId: admin.id,
            toolQrCode: decodedText,
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
                        <CardDescription>Total Tools</CardDescription>
                        <CardTitle className="text-3xl">
                            {tools.length}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-gray-500">
                            {tools.reduce((sum, t) => sum + t.quantity, 0)}{" "}
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

export default AdminOverview;
