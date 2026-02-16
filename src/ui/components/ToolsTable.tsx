import type { Tool } from "@/pages/AdminDashboard";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { useState } from "react";
import CreateToolsDialog from "./CreateToolsDialog";
import QrImageDialog from "./QrImageDialog";
import DataTable from "./DataTable";
import type { ColumnDef, FilterFn } from "@tanstack/react-table";
import { ArrowUpDown, SearchIcon } from "lucide-react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";

const globalFilterFn: FilterFn<Tool> = (row, _columnId, filterValue) => {
    const search = filterValue.toLowerCase();
    const tool = row.original;

    return tool.name.toLowerCase().includes(search);
};

const ToolsTable = ({ tools }: { tools: Tool[] }) => {
    const [openCreateToolsDialog, setOpenCreateToolsDialog] = useState(false);
    const [openQrImageDialog, setOpenQrImageDialog] = useState(false);
    const [selectedQrCode, setSelectedQrCode] = useState({
        name: "",
        image: "",
    });
    const [globalFilter, setGlobalFilter] = useState("");

    const toolColumns: ColumnDef<Tool>[] = [
        {
            accessorKey: "qrCodeImage",
            header: "QR Code",
            cell: ({ row }) => {
                const tool = row.original;
                return (
                    <img
                        src={tool.qrCodeImage}
                        alt={tool.name}
                        width={50}
                        className="cursor-pointer"
                        onClick={() => {
                            setSelectedQrCode({
                                name: tool.name,
                                image: tool.qrCodeImage,
                            });
                            setOpenQrImageDialog(true);
                        }}
                    />
                );
            },
        },
        {
            id: "name",
            accessorKey: "name",
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
                const tool = row.original;
                return <span className="font-medium">{tool.name}</span>;
            },
        },
        {
            id: "quantity",
            accessorKey: "quantity",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                    >
                        Quantity
                        <ArrowUpDown className="h-4 w-4" />
                    </Button>
                );
            },
        },
    ];
    return (
        <>
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Tools</CardTitle>
                                <CardDescription>
                                    Manage all tracked tools
                                </CardDescription>
                            </div>
                        </div>
                        <div>
                            <Button
                                onClick={() => {
                                    setOpenCreateToolsDialog(true);
                                }}
                            >
                                Add Tools
                            </Button>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <InputGroup className="w-6/12">
                            <InputGroupInput
                                id="inline-start-input"
                                placeholder="Search by tool's name..."
                                value={globalFilter}
                                onChange={(e) =>
                                    setGlobalFilter(e.target.value)
                                }
                            />
                            <InputGroupAddon align="inline-start">
                                <SearchIcon className="text-muted-foreground" />
                            </InputGroupAddon>
                        </InputGroup>
                    </div>
                </CardHeader>
                <CardContent>
                    <DataTable
                        data={tools}
                        columns={toolColumns}
                        globalFilter={globalFilter}
                        setGlobalFilter={setGlobalFilter}
                        globalFilterFn={globalFilterFn}
                    />
                </CardContent>
            </Card>
            <CreateToolsDialog
                open={openCreateToolsDialog}
                onOpenChange={setOpenCreateToolsDialog}
            />
            <QrImageDialog
                qrCode={selectedQrCode}
                open={openQrImageDialog}
                onOpenChange={setOpenQrImageDialog}
            />
        </>
    );
};

export default ToolsTable;
