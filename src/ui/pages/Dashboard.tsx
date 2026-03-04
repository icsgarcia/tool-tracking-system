import { useGetUserTransactions } from "@/hooks/useTransactions";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { toast } from "sonner";
import Header from "@/components/Header";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import DataTable from "@/components/DataTable";
import type { ColumnDef, SortingState } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
    ArrowUpDown,
    SearchIcon,
    ArrowLeftRight,
    Package,
    Undo2,
} from "lucide-react";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group";
import PrintButton from "@/components/PrintButton";
import BorrowAssetDialog from "@/components/BorrowAssetDialog";
import ReturnAssetDialog from "@/components/ReturnAssetDialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const Dashboard = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const user = location.state?.user;
    const admin = location.state?.admin;
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });
    const [sorting, setSorting] = useState<SortingState>([]);
    const contentRef = useRef<HTMLDivElement>(null);
    const [openBorrowDialog, setOpenBorrowDialog] = useState(false);
    const [openReturnDialog, setOpenReturnDialog] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
            setPagination((prev) => ({ ...prev, pageIndex: 0 }));
        }, 300);
        return () => clearTimeout(timer);
    }, [search]);

    const sortBy = sorting[0]?.id;
    const sortOrder = sorting[0]?.desc ? "desc" : "asc";

    const { data } = useGetUserTransactions(user.id, {
        page: pagination.pageIndex,
        pageSize: pagination.pageSize,
        search: debouncedSearch || undefined,
        sortBy,
        sortOrder,
    });

    const transactions = data?.data ?? [];
    const pageCount = Math.ceil((data?.totalCount ?? 0) / pagination.pageSize);

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
                const isBorrowed = transaction.status === "BORROWED";
                return (
                    <Badge
                        variant="outline"
                        className={
                            isBorrowed
                                ? "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800"
                                : "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800"
                        }
                    >
                        {transaction.status}
                    </Badge>
                );
            },
        },
    ];

    return (
        <div className="mx-auto max-w-7xl min-h-svh">
            <Header user={user} handleLogout={handleLogout} />

            <div className="flex flex-col gap-4 px-3 sm:px-4 py-4 sm:py-6 mb-8">
                <Card ref={contentRef}>
                    <CardHeader>
                        <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center mb-4 print:mb-0">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 print:hidden">
                                    <ArrowLeftRight className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg sm:text-xl print:font-bold print:text-3xl">
                                        Transactions
                                    </CardTitle>
                                    <CardDescription className="print:hidden">
                                        Your borrowing and return history
                                    </CardDescription>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 print:hidden">
                                <Button
                                    onClick={() => setOpenBorrowDialog(true)}
                                >
                                    <Package className="w-4 h-4" />
                                    Borrow
                                </Button>
                                <Button
                                    onClick={() => setOpenReturnDialog(true)}
                                    variant="outline"
                                >
                                    <Undo2 className="w-4 h-4" />
                                    Return
                                </Button>
                            </div>
                        </div>
                        <Separator className="print:hidden" />
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between print:hidden pt-2">
                            <InputGroup className="w-full sm:w-7/12 lg:w-4/12">
                                <InputGroupInput
                                    id="inline-start-input"
                                    placeholder="Search for a transaction..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
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
                            data={transactions}
                            columns={userTransactionColumns}
                            pageCount={pageCount}
                            pagination={pagination}
                            onPaginationChange={setPagination}
                            sorting={sorting}
                            onSortingChange={setSorting}
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
