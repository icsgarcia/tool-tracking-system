import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import CreateAssetsDialog from "./CreateAssetsDialog";
import QrImageDialog from "./QrImageDialog";
import DataTable from "./DataTable";
import type {
    ColumnDef,
    RowSelectionState,
    SortingState,
} from "@tanstack/react-table";
import {
    ArrowUpDown,
    EllipsisVertical,
    SearchIcon,
    Package,
    PackagePlus,
    Pencil,
    Trash2,
    MoreHorizontal,
} from "lucide-react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import DeleteAssetDialog from "./DeleteAssetDialog";
import UpdateAssetDialog from "./UpdateAssetDialog";
import DeleteAllAssetsDialog from "./DeleteAllAssetsDialog";
import DeleteSelectedAssetsDialog from "./DeleteSelectedAssetsDialog";
import ExportPdfButton from "./ExportPdfButton";
import { Separator } from "./ui/separator";
import AssetDetailDialog from "./AssetDetailDialog";
import { useGetAllAssets } from "@/hooks/useAssets";
import { Checkbox } from "./ui/checkbox";
import ExportExcel from "./ExportExcel";

const AssetsTable = () => {
    const [openCreateAssetsDialog, setOpenCreateAssetsDialog] = useState(false);
    const [openQrImageDialog, setOpenQrImageDialog] = useState(false);
    const [selectedQrCode, setSelectedQrCode] = useState({
        name: "",
        image: "",
    });
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });
    const [sorting, setSorting] = useState<SortingState>([]);
    const [selectedAsset, setSelectedAsset] = useState<Asset>();
    const [openUpdateAsset, setOpenUpdateAsset] = useState(false);
    const [openDeleteAsset, setOpenDeleteAsset] = useState(false);
    const [openDeleteAllAssetsDialog, setOpenDeleteAllAssetsDialog] =
        useState(false);
    const [openAssetDetailDialog, setOpenAssetDetailDialog] = useState(false);
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
    const [openDeleteSelectedDialog, setOpenDeleteSelectedDialog] =
        useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
            setPagination((prev) => ({ ...prev, pageIndex: 0 }));
        }, 300);
        return () => clearTimeout(timer);
    }, [search]);

    const sortBy = sorting[0]?.id;
    const sortOrder = sorting[0]?.desc ? "desc" : "asc";

    const { data } = useGetAllAssets({
        page: pagination.pageIndex,
        pageSize: pagination.pageSize,
        search: debouncedSearch || undefined,
        sortBy,
        sortOrder,
    });

    const assets = data?.data ?? [];
    const pageCount = Math.ceil((data?.totalCount ?? 0) / pagination.pageSize);

    const selectedAssetIds = Object.keys(rowSelection);

    const assetColumns: ColumnDef<Asset>[] = [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) =>
                        table.toggleAllPageRowsSelected(!!value)
                    }
                    aria-label="Select all"
                    className="print:hidden"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                    className="print:hidden"
                />
            ),
            enableSorting: false,
        },
        {
            accessorKey: "qrCodeImage",
            header: "QR Code",
            cell: ({ row }) => {
                const asset = row.original;
                return (
                    <img
                        src={asset.qrCodeImage}
                        alt={asset.assetName}
                        width={50}
                        className="cursor-pointer rounded-md border hover:opacity-80 transition-opacity"
                        onClick={() => {
                            setSelectedQrCode({
                                name: asset.assetName,
                                image: asset.qrCodeImage,
                            });
                            setOpenQrImageDialog(true);
                        }}
                    />
                );
            },
        },
        {
            id: "temporaryTagNumber",
            accessorKey: "temporaryTagNumber",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                    >
                        Tag No.
                        <ArrowUpDown className="h-4 w-4 print:hidden" />
                    </Button>
                );
            },
            cell: ({ row }) => {
                const asset = row.original;
                return (
                    <span
                        onClick={() => {
                            setSelectedAsset(asset);
                            setOpenAssetDetailDialog(true);
                        }}
                        className="font-medium cursor-pointer hover:underline"
                    >
                        {asset.temporaryTagNumber}
                    </span>
                );
            },
        },
        {
            id: "assetName",
            accessorKey: "assetName",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                    >
                        Tool Name
                        <ArrowUpDown className="h-4 w-4 print:hidden" />
                    </Button>
                );
            },
            cell: ({ row }) => {
                const asset = row.original;
                return (
                    <span
                        onClick={() => {
                            setSelectedAsset(asset);
                            setOpenAssetDetailDialog(true);
                        }}
                        className="font-medium cursor-pointer hover:underline"
                    >
                        {asset.assetName}
                    </span>
                );
            },
        },
        {
            id: "assetCount",
            accessorKey: "assetCount",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                    >
                        Total Qty
                        <ArrowUpDown className="h-4 w-4 print:hidden" />
                    </Button>
                );
            },
        },
        {
            id: "borrowedCount",
            accessorKey: "borrowedCount",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                    >
                        Checked Out
                        <ArrowUpDown className="h-4 w-4 print:hidden" />
                    </Button>
                );
            },
        },
        {
            id: "availableCount",
            accessorKey: "availableCount",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                    >
                        Available
                        <ArrowUpDown className="h-4 w-4 print:hidden" />
                    </Button>
                );
            },
        },
        {
            accessorKey: "action",
            header: () => <span className="print:hidden">Action</span>,
            cell: ({ row }) => (
                <div className="print:hidden">
                    <DropdownMenu>
                        {/* <DropdownMenuTrigger asChild> */}
                        <DropdownMenuTrigger>
                            <Button variant="ghost" size="icon-xs">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuGroup>
                                <DropdownMenuItem
                                    onClick={() => {
                                        setSelectedAsset(row.original);
                                        setOpenUpdateAsset(true);
                                    }}
                                >
                                    <Pencil className="h-4 w-4" />
                                    Edit Tool
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                    onClick={() => {
                                        setSelectedAsset(row.original);
                                        setOpenDeleteAsset(true);
                                    }}
                                    className="text-destructive focus:text-destructive"
                                >
                                    <Trash2 className="h-4 w-4" />
                                    Delete Tool
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            ),
        },
    ];

    return (
        <>
            <Card>
                <CardHeader>
                    <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center mb-4 print:mb-0">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 print:hidden">
                                <Package className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <CardTitle className="text-lg sm:text-xl print:font-bold print:text-3xl">
                                    Tools
                                </CardTitle>
                                <CardDescription className="print:hidden">
                                    Manage all tracked tools
                                </CardDescription>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 print:hidden">
                            {selectedAssetIds.length > 0 && (
                                <Button
                                    size="sm"
                                    variant="destructive"
                                    className="sm:size-default"
                                    onClick={() =>
                                        setOpenDeleteSelectedDialog(true)
                                    }
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Delete ({selectedAssetIds.length})
                                </Button>
                            )}
                            <Button
                                size="sm"
                                className="sm:size-default"
                                onClick={() => {
                                    setOpenCreateAssetsDialog(true);
                                }}
                            >
                                <PackagePlus className="w-4 h-4" />
                                Add Tools
                            </Button>
                            <DropdownMenu>
                                {/* <DropdownMenuTrigger asChild> */}
                                <DropdownMenuTrigger>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="sm:size-default"
                                    >
                                        <EllipsisVertical />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuGroup>
                                        <DropdownMenuItem
                                            onClick={() =>
                                                setOpenDeleteAllAssetsDialog(
                                                    true,
                                                )
                                            }
                                            disabled={assets.length <= 0}
                                            className="text-destructive focus:text-destructive"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            Delete all tools
                                        </DropdownMenuItem>
                                    </DropdownMenuGroup>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                    <Separator className="print:hidden" />
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between print:hidden pt-2">
                        <InputGroup className="w-full sm:w-7/12 lg:w-4/12">
                            <InputGroupInput
                                id="inline-start-input"
                                placeholder="Search by tool's name..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <InputGroupAddon align="inline-start">
                                <SearchIcon className="text-muted-foreground" />
                            </InputGroupAddon>
                        </InputGroup>
                        <div className="flex gap-4">
                            <ExportExcel
                                files="assets"
                                search={debouncedSearch}
                                sortBy={sortBy}
                                sortOrder={sortOrder}
                            />
                            <ExportPdfButton type="assets" />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <DataTable
                        data={assets}
                        columns={assetColumns}
                        pageCount={pageCount}
                        pagination={pagination}
                        onPaginationChange={setPagination}
                        sorting={sorting}
                        onSortingChange={setSorting}
                        rowSelection={rowSelection}
                        onRowSelectionChange={setRowSelection}
                        getRowId={(row) => row.id}
                    />
                </CardContent>
            </Card>
            <CreateAssetsDialog
                openCreateAssetsDialog={openCreateAssetsDialog}
                setOpenCreateAssetsDialog={setOpenCreateAssetsDialog}
            />
            <QrImageDialog
                qrCode={selectedQrCode}
                open={openQrImageDialog}
                onOpenChange={setOpenQrImageDialog}
            />
            {openUpdateAsset && selectedAsset && (
                <UpdateAssetDialog
                    openUpdateAsset={openUpdateAsset}
                    setOpenUpdateAsset={setOpenUpdateAsset}
                    asset={selectedAsset}
                />
            )}
            {openDeleteAsset && selectedAsset && (
                <DeleteAssetDialog
                    openDeleteAsset={openDeleteAsset}
                    setOpenDeleteAsset={setOpenDeleteAsset}
                    asset={selectedAsset}
                />
            )}
            {openDeleteAllAssetsDialog && (
                <DeleteAllAssetsDialog
                    openDeleteAllAssetsDialog={openDeleteAllAssetsDialog}
                    setOpenDeleteAllAssetsDialog={setOpenDeleteAllAssetsDialog}
                />
            )}
            {openAssetDetailDialog && selectedAsset && (
                <AssetDetailDialog
                    openAssetDetailDialog={openAssetDetailDialog}
                    setOpenAssetDetailDialog={setOpenAssetDetailDialog}
                    asset={selectedAsset}
                />
            )}
            {openDeleteSelectedDialog && selectedAssetIds.length > 0 && (
                <DeleteSelectedAssetsDialog
                    open={openDeleteSelectedDialog}
                    setOpen={setOpenDeleteSelectedDialog}
                    assetIds={selectedAssetIds}
                    onSuccess={() => setRowSelection({})}
                />
            )}
        </>
    );
};

export default AssetsTable;
