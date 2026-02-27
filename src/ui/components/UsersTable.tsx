import { Badge } from "./ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "./ui/card";

import CreateUsersDialog from "./CreateUsersDialog";
import { useRef, useState } from "react";
import { Button } from "./ui/button";
import QrImageDialog from "./QrImageDialog";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";
import {
    SearchIcon,
    ArrowUpDown,
    Ellipsis,
    EllipsisVertical,
} from "lucide-react";
import { type ColumnDef, type FilterFn } from "@tanstack/react-table";
import DataTable from "./DataTable";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import DeleteUserDialog from "./DeleteUserDialog";
import UpdateUserDialog from "./UpdateUserDialog";
import DeleteAllUsersDialog from "./DeleteAllUsersDialog";
import { useLocation } from "react-router";
import PrintButton from "./PrintButton";

const globalFilterFn: FilterFn<User> = (row, _columnId, filterValue) => {
    const search = filterValue.toLowerCase();
    const user = row.original;
    const fullName =
        `${user.firstName} ${user.middleName} ${user.lastName}`.toLowerCase();
    return (
        fullName.includes(search) ||
        user.schoolNumber.toLowerCase().includes(search) ||
        user.email.toLowerCase().includes(search)
    );
};

const UsersTable = ({ users }: { users: User[] }) => {
    const location = useLocation();
    const user = location?.state?.user;
    const contentRef = useRef<HTMLDivElement>(null);
    const [openCreateUsersDialog, setOpenCreateUsersDialog] =
        useState<boolean>(false);
    const [openQrImageDialog, setOpenQrImageDialog] = useState(false);
    const [selectedQrCode, setSelectedQrCode] = useState({
        name: "",
        image: "",
    });
    const [globalFilter, setGlobalFilter] = useState("");
    const [selectedUser, setSelectedUser] = useState<User>();
    const [openDeleteUser, setOpenDeleteUser] = useState(false);
    const [openUpdateUser, setOpenUpdateUser] = useState(false);
    const [openDeleteAllUsersDialog, setOpenDeleteAllUsersDialog] =
        useState(false);

    const userColumns: ColumnDef<User>[] = [
        {
            accessorKey: "qrCodeImage",
            header: "QR Code",
            cell: ({ row }) => {
                const user = row.original;
                return (
                    <img
                        src={user.qrCodeImage}
                        alt={`${user.lastName} ${user.firstName} ${user.middleName}`}
                        width={50}
                        className="cursor-pointer"
                        onClick={() => {
                            setSelectedQrCode({
                                name: `${user.lastName} ${user.firstName} ${user.middleName}`,
                                image: user.qrCodeImage,
                            });
                            setOpenQrImageDialog(true);
                        }}
                    />
                );
            },
        },
        {
            id: "name",
            accessorFn: (row) =>
                `${row.firstName} ${row.middleName} ${row.lastName}`,
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                    >
                        Name
                        <ArrowUpDown className="h-4 w-4 print:hidden" />
                    </Button>
                );
            },
            cell: ({ row }) => {
                const user = row.original;
                return (
                    <span className="font-medium">
                        {user.firstName} {user.middleName} {user.lastName}
                    </span>
                );
            },
        },
        {
            accessorKey: "schoolNumber",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                    >
                        School No.
                        <ArrowUpDown className="h-4 w-4 print:hidden" />
                    </Button>
                );
            },
        },
        {
            accessorKey: "email",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                    >
                        Email
                        <ArrowUpDown className="h-4 w-4 print:hidden" />
                    </Button>
                );
            },
        },
        {
            accessorKey: "role",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                    >
                        Role
                        <ArrowUpDown className="h-4 w-4 print:hidden" />
                    </Button>
                );
            },
            cell: ({ row }) => (
                <Badge variant="outline">{row.original.role}</Badge>
            ),
        },
        {
            accessorKey: "department",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                    >
                        Dept.
                        <ArrowUpDown className="h-4 w-4 print:hidden" />
                    </Button>
                );
            },
            cell: ({ row }) => row.original.department || "—",
        },
        {
            accessorKey: "yearLevel",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                    >
                        Year
                        <ArrowUpDown className="h-4 w-4 print:hidden" />
                    </Button>
                );
            },
        },
        {
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
            cell: ({ row }) => (
                <Badge
                    variant={
                        row.original.status === "ACTIVE"
                            ? "default"
                            : "secondary"
                    }
                >
                    {row.original.status}
                </Badge>
            ),
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
                                        setSelectedUser(row.original);
                                        setOpenUpdateUser(true);
                                    }}
                                >
                                    Edit User
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => {
                                        setSelectedUser(row.original);
                                        setOpenDeleteUser(true);
                                    }}
                                >
                                    Delete User
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
                                Users
                            </CardTitle>
                            <CardDescription className="print:hidden">
                                Manage all registered users
                            </CardDescription>
                        </div>
                        <div className="flex items-center gap-1 print:hidden">
                            <Button
                                size="sm"
                                className="sm:size-default"
                                onClick={() => {
                                    setOpenCreateUsersDialog(true);
                                }}
                            >
                                Add Users
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
                                                setOpenDeleteAllUsersDialog(
                                                    true,
                                                )
                                            }
                                            disabled={users.length <= 1}
                                        >
                                            Delete all users
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
                                placeholder="Search by name, school no., or email..."
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
                        data={users}
                        columns={userColumns}
                        globalFilter={globalFilter}
                        setGlobalFilter={setGlobalFilter}
                        globalFilterFn={globalFilterFn}
                    />
                </CardContent>
            </Card>
            <CreateUsersDialog
                openCreateUsersDialog={openCreateUsersDialog}
                setOpenCreateUsersDialog={setOpenCreateUsersDialog}
            />
            <QrImageDialog
                qrCode={selectedQrCode}
                open={openQrImageDialog}
                onOpenChange={setOpenQrImageDialog}
            />
            {openDeleteUser && selectedUser && (
                <DeleteUserDialog
                    openDeleteUser={openDeleteUser}
                    setOpenDeleteUser={setOpenDeleteUser}
                    user={selectedUser}
                />
            )}
            {openUpdateUser && selectedUser && (
                <UpdateUserDialog
                    openUpdateUser={openUpdateUser}
                    setOpenUpdateUser={setOpenUpdateUser}
                    user={selectedUser}
                />
            )}
            {openDeleteAllUsersDialog && (
                <DeleteAllUsersDialog
                    openDeleteAllUsersDialog={openDeleteAllUsersDialog}
                    setOpenDeleteAllUsersDialog={setOpenDeleteAllUsersDialog}
                    userId={user.id}
                />
            )}
        </>
    );
};

export default UsersTable;
