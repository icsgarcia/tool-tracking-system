import { useGetUserTransactions } from "@/hooks/useTransactions";
import { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { toast } from "sonner";
import ProfileCard from "@/components/ProfileCard";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DataTable from "@/components/DataTable";
import type { ColumnDef, FilterFn } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, SearchIcon } from "lucide-react";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group";
import PrintButton from "@/components/PrintButton";
import BorrowAssetDialog from "@/components/BorrowAssetDialog";
import ReturnAssetDialog from "@/components/ReturnAssetDialog";
import { Badge } from "@/components/ui/badge";

const globalFilterFn: FilterFn<UserTransactions> = (
    row,
    _columnId,
    filterValue,
) => {
    const search = filterValue.toLowerCase();
    const transaction = row.original;

    return transaction.userId.toLowerCase().includes(search);
};

const Dashboard = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const user = location.state?.user;
    const admin = location.state?.admin;
    const { data: userTransactions = [] } = useGetUserTransactions(user.id);
    const [globalFilter, setGlobalFilter] = useState("");
    const contentRef = useRef<HTMLDivElement>(null);
    const [openBorrowDialog, setOpenBorrowDialog] = useState(false);
    const [openReturnDialog, setOpenReturnDialog] = useState(false);

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
            <div className="flex min-h-svh flex-col items-center justify-center gap-4 p-4">
                <p className="text-muted-foreground text-sm sm:text-base text-center">
                    No user data. Please scan your QR code.
                </p>
                <Button onClick={() => navigate("/")}>Go to Login</Button>
            </div>
        );
    }

    const userTransactionColumns: ColumnDef<UserTransactions>[] = [
        {
            accessorKey: "id",
            header: "ID",
        },
        {
            id: "assetName",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                    >
                        Asset Name
                        <ArrowUpDown className="h-4 w-4 print:hidden" />
                    </Button>
                );
            },
            cell: ({ row }) => {
                const userTransaction = row.original;
                return (
                    <span className="font-medium">
                        {userTransaction.asset.assetName}
                    </span>
                );
            },
        },
        {
            id: "borrowedQuantity",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                    >
                        Borrowed Qty
                        <ArrowUpDown className="h-4 w-4 print:hidden" />
                    </Button>
                );
            },
            cell: ({ row }) => {
                const userTransaction = row.original;
                return (
                    <span className="font-medium">
                        {userTransaction.borrowCount}
                    </span>
                );
            },
        },
        {
            id: "returnedQuantity",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                    >
                        Returned Qty
                        <ArrowUpDown className="h-4 w-4 print:hidden" />
                    </Button>
                );
            },
            cell: ({ row }) => {
                const userTransaction = row.original;
                return (
                    <span className="font-medium">
                        {userTransaction.returnCount}
                    </span>
                );
            },
        },
        {
            id: "borrowedDate",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                    >
                        Borrowed Date
                        <ArrowUpDown className="h-4 w-4 print:hidden" />
                    </Button>
                );
            },
            cell: ({ row }) => {
                const userTransaction = row.original;
                const borrowedDate = userTransaction.borrowedAt;
                return (
                    <span className="font-medium">
                        {new Date(borrowedDate).toLocaleString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </span>
                );
            },
        },
        {
            id: "returnedDate",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                    >
                        Returned Date
                        <ArrowUpDown className="h-4 w-4 print:hidden" />
                    </Button>
                );
            },
            cell: ({ row }) => {
                const userTransaction = row.original;
                const returnedDate = userTransaction.returnedAt;
                return (
                    <span className="font-medium">
                        {returnedDate
                            ? new Date(returnedDate).toLocaleString("en-US", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                              })
                            : "-"}
                    </span>
                );
            },
        },
        {
            id: "status",
            accessorKey: "status",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                    >
                        Status
                        <ArrowUpDown className="h-4 w-4 print:hidden" />
                    </Button>
                );
            },
            cell: ({ row }) => {
                const transaction = row.original;
                return <Badge variant="outline">{transaction.status}</Badge>;
            },
        },
    ];

    return (
        <div className="mx-auto max-w-7xl min-h-svh">
            <Header user={user} handleLogout={handleLogout} />

            <div className="flex flex-col gap-4 px-3 sm:px-4 py-4 sm:py-6 mb-8">
                <ProfileCard user={user} />

                <Card ref={contentRef}>
                    <CardHeader>
                        <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center mb-4 print:mb-0">
                            <div>
                                <CardTitle className="text-lg sm:text-xl print:font-bold print:text-3xl">
                                    Transactions
                                </CardTitle>
                            </div>
                            <div className="flex items-center gap-1 print:hidden">
                                <Button
                                    onClick={() => setOpenBorrowDialog(true)}
                                >
                                    Borrow
                                </Button>
                                <Button
                                    onClick={() => setOpenReturnDialog(true)}
                                    variant={"outline"}
                                >
                                    Return
                                </Button>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between print:hidden">
                            <InputGroup className="w-full sm:w-7/12 lg:w-4/12">
                                <InputGroupInput
                                    id="inline-start-input"
                                    placeholder="Search for a transaction..."
                                    value={globalFilter}
                                    onChange={(e) =>
                                        setGlobalFilter(e.target.value)
                                    }
                                />
                                <InputGroupAddon align="inline-start">
                                    <SearchIcon className="text-muted-foreground" />
                                </InputGroupAddon>
                            </InputGroup>
                            <PrintButton contentRef={contentRef} />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <DataTable
                            data={userTransactions}
                            columns={userTransactionColumns}
                            globalFilter={globalFilter}
                            setGlobalFilter={setGlobalFilter}
                            globalFilterFn={globalFilterFn}
                        />
                    </CardContent>
                </Card>
            </div>
            {openBorrowDialog && (
                <BorrowAssetDialog
                    user={user}
                    openBorrowDialog={openBorrowDialog}
                    setOpenBorrowDialog={setOpenBorrowDialog}
                />
            )}
            {openReturnDialog && (
                <ReturnAssetDialog
                    user={user}
                    openReturnDialog={openReturnDialog}
                    setOpenReturnDialog={setOpenReturnDialog}
                />
            )}
        </div>
    );
};

export default Dashboard;
