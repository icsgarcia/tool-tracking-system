import type { Tool } from "@/pages/AdminDashboard";
import { Badge } from "./ui/badge";
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
import { Button } from "./ui/button";
import { useState } from "react";
import CreateToolsDialog from "./CreateToolsDialog";
import QrImageDialog from "./QrImageDialog";

interface SelectedQrCode {
    name: string;
    image: string;
}

const ToolsTable = ({ tools }: { tools: Tool[] }) => {
    const [openCreateToolsDialog, setOpenCreateToolsDialog] = useState(false);
    const [openQrImageDialog, setOpenQrImageDialog] = useState(false);
    const [selectedQrCode, setSelectedQrCode] = useState({
        name: "",
        image: "",
    });
    return (
        <>
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
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
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>QR Image</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Quantity</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {tools.map((tool) => (
                                <TableRow key={tool.id}>
                                    <TableCell>
                                        <img
                                            src={tool.qrCodeImage}
                                            alt={tool.name}
                                            width={50}
                                            onClick={() => {
                                                setSelectedQrCode({
                                                    name: tool.name,
                                                    image: tool.qrCodeImage,
                                                });
                                                setOpenQrImageDialog(true);
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        {tool.name}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">
                                            {tool.quantity}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {tools.length === 0 && (
                                <TableRow>
                                    <TableCell
                                        colSpan={3}
                                        className="text-center text-gray-500"
                                    >
                                        No tools found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
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
