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
    EllipsisVertical,
    Users,
    UserPlus,
    Pencil,
    Trash2,
    MoreHorizontal,
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
import { Separator } from "./ui/separator";

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
                        className="cursor-pointer rounded-md border hover:opacity-80 transition-opacity"
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
                const fullName =
                    `${user.firstName} ${user.middleName} ${user.lastName}`
                        .toLowerCase()
                        .split(" ")
                        .map(
                            (word) =>
                                word.charAt(0).toUpperCase() + word.slice(1),
                        )
                        .join(" ");
                return <span className="font-medium">{fullName}</span>;
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
            cell: ({ row }) => {
                const email = row.original.email;
                return email && email !== "undefined" ? email : "—";
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
                    className={
                        row.original.status === "ACTIVE"
                            ? "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800"
                            : ""
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
                            <Button variant="ghost" size="icon-xs">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuGroup>
                                <DropdownMenuItem
                                    onClick={() => {
                                        setSelectedUser(row.original);
                                        setOpenUpdateUser(true);
                                    }}
                                >
                                    <Pencil className="h-4 w-4" />
                                    Edit User
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => {
                                        setSelectedUser(row.original);
                                        setOpenDeleteUser(true);
                                    }}
                                    className="text-destructive focus:text-destructive"
                                >
                                    <Trash2 className="h-4 w-4" />
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
                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 print:hidden">
                                <Users className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <CardTitle className="text-lg sm:text-xl print:font-bold print:text-3xl">
                                    Users
                                </CardTitle>
                                <CardDescription className="print:hidden">
                                    Manage all registered users
                                </CardDescription>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 print:hidden">
                            <Button
                                size="sm"
                                className="sm:size-default"
                                onClick={() => {
                                    setOpenCreateUsersDialog(true);
                                }}
                            >
                                <UserPlus className="w-4 h-4" />
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
                                <DropdownMenuContent align="end">
                                    <DropdownMenuGroup>
                                        <DropdownMenuItem
                                            onClick={() =>
                                                setOpenDeleteAllUsersDialog(
                                                    true,
                                                )
                                            }
                                            disabled={users.length <= 1}
                                            className="text-destructive focus:text-destructive"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            Delete all users
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
