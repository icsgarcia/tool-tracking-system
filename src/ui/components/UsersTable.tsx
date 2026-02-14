import type { User } from "@/pages/AdminDashboard";
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
import CreateUsersDialog from "./CreateUsersDialog";
import { useState } from "react";
import { Button } from "./ui/button";
import QrImageDialog from "./QrImageDialog";

const UsersTable = ({ users }: { users: User[] }) => {
    const [openCreateUsersDialog, setOpenCreateUsersDialog] =
        useState<boolean>(false);
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
                                <CardTitle>Users</CardTitle>
                                <CardDescription>
                                    Manage all registered users
                                </CardDescription>
                            </div>
                        </div>
                        <div>
                            <Button
                                onClick={() => {
                                    setOpenCreateUsersDialog(true);
                                }}
                            >
                                Add Users
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>QR Code</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>School No.</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Department</TableHead>
                                <TableHead>Year</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>
                                        <img
                                            src={user.qrCodeImage}
                                            alt={`${user.lastName} ${user.firstName} ${user.middleName}`}
                                            width={50}
                                            onClick={() => {
                                                setSelectedQrCode({
                                                    name: `${user.lastName} ${user.firstName} ${user.middleName}`,
                                                    image: user.qrCodeImage,
                                                });
                                                setOpenQrImageDialog(true);
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        {user.firstName} {user.middleName}{" "}
                                        {user.lastName}
                                    </TableCell>
                                    <TableCell>{user.schoolNumber}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">
                                            {user.role}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {user.department || "—"}
                                    </TableCell>
                                    <TableCell>{user.yearLevel}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                user.status === "ACTIVE"
                                                    ? "default"
                                                    : "secondary"
                                            }
                                        >
                                            {user.status}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {users.length === 0 && (
                                <TableRow>
                                    <TableCell
                                        colSpan={7}
                                        className="text-center text-gray-500"
                                    >
                                        No users found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            <CreateUsersDialog
                open={openCreateUsersDialog}
                onOpenChange={setOpenCreateUsersDialog}
            />
            <QrImageDialog
                qrCode={selectedQrCode}
                open={openQrImageDialog}
                onOpenChange={setOpenQrImageDialog}
            />
        </>
    );
};

export default UsersTable;
