import type { Transactions } from "@/types/transactions";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import type { ColumnDef, FilterFn } from "@tanstack/react-table";
import { useState } from "react";
import DataTable from "./DataTable";
import { ArrowUpDown, SearchIcon } from "lucide-react";
import { Button } from "./ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";

const globalFilterFn: FilterFn<Transactions> = (
    row,
    _columnId,
    filterValue,
) => {
    const search = filterValue.toLowerCase();
    const transaction = row.original;

    return transaction.userId.toLowerCase().includes(search);
};

const TransactionsTable = ({
    transactions,
}: {
    transactions: Transactions[];
}) => {
    const [globalFilter, setGlobalFilter] = useState("");

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
                        Name
                        <ArrowUpDown className="h-4 w-4" />
                    </Button>
                );
            },
            cell: ({ row }) => {
                const transaction = row.original;
                const userFullName = `${transaction.user.firstName} ${transaction.user.middleName} ${transaction.user.lastName}`;
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
                        Name
                        <ArrowUpDown className="h-4 w-4" />
                    </Button>
                );
            },
            cell: ({ row }) => {
                const transaction = row.original;
                return (
                    <span className="font-medium">
                        {transaction.asset.name}
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
                        <ArrowUpDown className="h-4 w-4" />
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
                        <ArrowUpDown className="h-4 w-4" />
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
                    : "—";
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
                        <ArrowUpDown className="h-4 w-4" />
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
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Transactions</CardTitle>
                            <CardDescription>
                                Asset borrowing and return history
                            </CardDescription>
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    <InputGroup className="w-6/12 md:w-6/12 lg:w-4/12">
                        <InputGroupInput
                            id="inline-start-input"
                            placeholder="Search by asset's name..."
                            value={globalFilter}
                            onChange={(e) => setGlobalFilter(e.target.value)}
                        />
                        <InputGroupAddon align="inline-start">
                            <SearchIcon className="text-muted-foreground" />
                        </InputGroupAddon>
                    </InputGroup>
                </div>
            </CardHeader>
            <CardContent>
                <DataTable
                    data={transactions}
                    columns={transactionColumns}
                    globalFilter={globalFilter}
                    setGlobalFilter={setGlobalFilter}
                    globalFilterFn={globalFilterFn}
                />
            </CardContent>
        </Card>
    );
};

export default TransactionsTable;
