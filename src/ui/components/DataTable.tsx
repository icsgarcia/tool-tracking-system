import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
    type ColumnDef,
    type FilterFn,
    type SortingState,
} from "@tanstack/react-table";
import { useMemo, useState, type Dispatch, type SetStateAction } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "./ui/table";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface DataTableType<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    globalFilter: string;
    setGlobalFilter: Dispatch<SetStateAction<string>>;
    globalFilterFn: FilterFn<TData>;
}

const DataTable = <TData, TValue>({
    columns,
    data,
    globalFilter,
    setGlobalFilter,
    globalFilterFn,
}: DataTableType<TData, TValue>) => {
    const [sorting, setSorting] = useState<SortingState>([]);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        globalFilterFn,
        state: {
            sorting,
            globalFilter,
        },
        onGlobalFilterChange: setGlobalFilter,
    });

    const currentPage = table.getState().pagination.pageIndex;
    const pageCount = table.getPageCount();

    const pageButtons = useMemo(() => {
        const maxVisible = 5;
        if (pageCount <= maxVisible) {
            return Array.from({ length: pageCount }, (_, i) => i);
        }

        let start = Math.max(0, currentPage - Math.floor(maxVisible / 2));
        let end = start + maxVisible;

        if (end > pageCount) {
            end = pageCount;
            start = Math.max(0, end - maxVisible);
        }

        return Array.from({ length: end - start }, (_, i) => start + i);
    }, [currentPage, pageCount]);

    return (
        <div className="w-full space-y-4">
            <div className="overflow-x-auto rounded-md border">
                <Table className="min-w-160">
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead
                                        key={header.id}
                                        className="whitespace-nowrap"
                                    >
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                  header.column.columnDef
                                                      .header,
                                                  header.getContext(),
                                              )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>

                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={
                                        row.getIsSelected() && "selected"
                                    }
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell
                                            key={cell.id}
                                            className="whitespace-nowrap"
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext(),
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex flex-col-reverse items-center gap-2 sm:flex-row sm:justify-between print:hidden">
                <p className="text-sm text-muted-foreground">
                    Page {currentPage + 1} of {pageCount}
                </p>

                <div className="flex items-center space-x-1 sm:space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        className="h-8 w-8 p-0 sm:h-9 sm:w-auto sm:px-3"
                    >
                        <ChevronLeft className="h-4 w-4 sm:hidden" />
                        <span className="hidden sm:inline">Previous</span>
                    </Button>

                    {pageButtons[0] > 0 && (
                        <>
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-8 w-8 p-0 sm:h-9"
                                onClick={() => table.setPageIndex(0)}
                            >
                                1
                            </Button>
                            {pageButtons[0] > 1 && (
                                <span className="px-1 text-muted-foreground text-sm">
                                    …
                                </span>
                            )}
                        </>
                    )}

                    {pageButtons.map((i) => (
                        <Button
                            key={i}
                            variant={currentPage === i ? "default" : "outline"}
                            size="sm"
                            className="h-8 w-8 p-0 sm:h-9"
                            onClick={() => table.setPageIndex(i)}
                        >
                            {i + 1}
                        </Button>
                    ))}

                    {pageButtons[pageButtons.length - 1] < pageCount - 1 && (
                        <>
                            {pageButtons[pageButtons.length - 1] <
                                pageCount - 2 && (
                                <span className="px-1 text-muted-foreground text-sm">
                                    …
                                </span>
                            )}
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-8 w-8 p-0 sm:h-9"
                                onClick={() =>
                                    table.setPageIndex(pageCount - 1)
                                }
                            >
                                {pageCount}
                            </Button>
                        </>
                    )}

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                        className="h-8 w-8 p-0 sm:h-9 sm:w-auto sm:px-3"
                    >
                        <ChevronRight className="h-4 w-4 sm:hidden" />
                        <span className="hidden sm:inline">Next</span>
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default DataTable;
