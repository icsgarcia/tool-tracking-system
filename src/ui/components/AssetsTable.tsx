import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { useRef, useState } from "react";
import CreateAssetsDialog from "./CreateAssetsDialog";
import QrImageDialog from "./QrImageDialog";
import DataTable from "./DataTable";
import type { ColumnDef, FilterFn } from "@tanstack/react-table";
import {
    ArrowUpDown,
    Ellipsis,
    EllipsisVertical,
    SearchIcon,
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
import PrintButton from "./PrintButton";

const globalFilterFn: FilterFn<Asset> = (row, _columnId, filterValue) => {
    const search = filterValue.toLowerCase();
    const asset = row.original;
    const assetTagNumber = `${asset.temporaryTagNumber}`.toLowerCase();
    const assetName = `${asset.assetName}`.toLowerCase();

    return assetName.includes(search) || assetTagNumber.includes(search);
};

const AssetsTable = ({ assets }: { assets: Asset[] }) => {
    const [openCreateAssetsDialog, setOpenCreateAssetsDialog] = useState(false);
    const [openQrImageDialog, setOpenQrImageDialog] = useState(false);
    const [selectedQrCode, setSelectedQrCode] = useState({
        name: "",
        image: "",
    });
    const [globalFilter, setGlobalFilter] = useState("");
    const [selectedAsset, setSelectedAsset] = useState<Asset>();
    const [openUpdateAsset, setOpenUpdateAsset] = useState(false);
    const [openDeleteAsset, setOpenDeleteAsset] = useState(false);
    const [openDeleteAllAssetsDialog, setOpenDeleteAllAssetsDialog] =
        useState(false);
    const contentRef = useRef<HTMLDivElement>(null);

    const assetColumns: ColumnDef<Asset>[] = [
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
                        className="cursor-pointer"
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
                    <span className="font-medium">
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
                        Asset Name
                        <ArrowUpDown className="h-4 w-4 print:hidden" />
                    </Button>
                );
            },
            cell: ({ row }) => {
                const asset = row.original;
                return <span className="font-medium">{asset.assetName}</span>;
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
                        <DropdownMenuTrigger asChild>
                            <Ellipsis />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuGroup>
                                <DropdownMenuItem
                                    onClick={() => {
                                        setSelectedAsset(row.original);
                                        setOpenUpdateAsset(true);
                                    }}
                                >
                                    Edit Asset
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                    onClick={() => {
                                        setSelectedAsset(row.original);
                                        setOpenDeleteAsset(true);
                                    }}
                                >
                                    Delete Asset
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
            <Card ref={contentRef}>
                <CardHeader>
                    <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center mb-4 print:mb-0">
                        <div>
                            <CardTitle className="text-lg sm:text-xl print:font-bold print:text-3xl">
                                Assets
                            </CardTitle>
                            <CardDescription className="print:hidden">
                                Manage all tracked assets
                            </CardDescription>
                        </div>
                        <div className="flex items-center gap-1 print:hidden">
                            <Button
                                size="sm"
                                className="sm:size-default"
                                onClick={() => {
                                    setOpenCreateAssetsDialog(true);
                                }}
                            >
                                Add Assets
                            </Button>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="sm:size-default"
                                    >
                                        <EllipsisVertical />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuGroup>
                                        <DropdownMenuItem
                                            onClick={() =>
                                                setOpenDeleteAllAssetsDialog(
                                                    true,
                                                )
                                            }
                                            disabled={assets.length <= 0}
                                        >
                                            Delete all assets
                                        </DropdownMenuItem>
                                    </DropdownMenuGroup>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between print:hidden">
                        <InputGroup className="w-full sm:w-7/12 lg:w-4/12">
                            <InputGroupInput
                                id="inline-start-input"
                                placeholder="Search by asset's name..."
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
                        data={assets}
                        columns={assetColumns}
                        globalFilter={globalFilter}
                        setGlobalFilter={setGlobalFilter}
                        globalFilterFn={globalFilterFn}
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
        </>
    );
};

export default AssetsTable;
