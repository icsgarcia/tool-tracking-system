import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import type { ColumnDef, SortingState } from "@tanstack/react-table";
import { useEffect, useRef, useState } from "react";
import DataTable from "./DataTable";
import { ArrowUpDown, ArrowLeftRight, SearchIcon } from "lucide-react";
import { Button } from "./ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";
import PrintButton from "./PrintButton";
import { Separator } from "./ui/separator";
import { useGetAllTransactions } from "@/hooks/useTransactions";

const TransactionsTable = () => {
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });
    const [sorting, setSorting] = useState<SortingState>([]);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
            setPagination((prev) => ({ ...prev, pageIndex: 0 }));
        }, 300);
        return () => clearTimeout(timer);
    }, [search]);

    const sortBy = sorting[0]?.id;
    const sortOrder = sorting[0]?.desc ? "desc" : "asc";

    const { data } = useGetAllTransactions({
        page: pagination.pageIndex,
        pageSize: pagination.pageSize,
        search: debouncedSearch || undefined,
        sortBy,
        sortOrder,
    });

    const transactions = data?.data ?? [];
    const pageCount = Math.ceil((data?.totalCount ?? 0) / pagination.pageSize);

    const transactionColumns: ColumnDef<Transactions>[] = [
        {
            accessorKey: "id",
            header: "ID",
        },
        {
            id: "userName",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                    >
                        User Name
                        <ArrowUpDown className="h-4 w-4 print:hidden" />
                    </Button>
                );
            },
            cell: ({ row }) => {
                const transaction = row.original;
                const userFullName =
                    `${transaction.user.firstName} ${transaction.user.middleName} ${transaction.user.lastName}`
                        .toLowerCase()
                        .split(" ")
                        .map(
                            (word) =>
                                word.charAt(0).toUpperCase() + word.slice(1),
                        )
                        .join(" ");
                return <span className="font-medium">{userFullName}</span>;
            },
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
                        Borrowed Asset
                        <ArrowUpDown className="h-4 w-4 print:hidden" />
                    </Button>
                );
            },
            cell: ({ row }) => {
                const transaction = row.original;
                return (
                    <span className="font-medium">
                        {transaction.asset.assetName}
                    </span>
                );
            },
        },
        {
            id: "borrowedAt",
            accessorKey: "borrowedAt",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                    >
                        Borrowed At
                        <ArrowUpDown className="h-4 w-4 print:hidden" />
                    </Button>
                );
            },
            cell: ({ row }) => {
                const borrowedDate = row.original.borrowedAt;
                return borrowedDate
                    ? new Date(borrowedDate).toLocaleString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                      })
                    : "—";
            },
        },
        {
            id: "returnedAt",
            accessorKey: "returnedAt",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                    >
                        Returned At
                        <ArrowUpDown className="h-4 w-4 print:hidden" />
                    </Button>
                );
            },
            cell: ({ row }) => {
                const returnedDate = row.original.returnedAt;
                return returnedDate
                    ? new Date(returnedDate).toLocaleString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                      })
                    : "-";
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
                                Asset borrowing and return history
                            </CardDescription>
                        </div>
                    </div>
                </div>
                <Separator className="print:hidden" />
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between print:hidden pt-2">
                    <InputGroup className="w-full sm:w-7/12 lg:w-4/12">
                        <InputGroupInput
                            id="inline-start-input"
                            placeholder="Search by asset's name..."
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
                    columns={transactionColumns}
                    pageCount={pageCount}
                    pagination={pagination}
                    onPaginationChange={setPagination}
                    sorting={sorting}
                    onSortingChange={setSorting}
                />
            </CardContent>
        </Card>
    );
};

export default TransactionsTable;
