import { Table } from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "./ui/card";
import {
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "./ui/table";
import { Badge } from "./ui/badge";
import type { Tool, User } from "@/pages/AdminDashboard";

interface AdminOverviewType {
    users: User[];
    tools: Tool[];
}

const AdminOverview = ({ users, tools }: AdminOverviewType) => {
    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader>
                        <CardDescription>Total Users</CardDescription>
                        <CardTitle className="text-3xl">
                            {users.length}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-gray-500">
                            {users.filter((u) => u.status === "ACTIVE").length}{" "}
                            active
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardDescription>Total Tools</CardDescription>
                        <CardTitle className="text-3xl">
                            {tools.length}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-gray-500">
                            {tools.reduce((sum, t) => sum + t.quantity, 0)}{" "}
                            total quantity
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardDescription>Transactions</CardDescription>
                        <CardTitle className="text-3xl">0</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-gray-500">0 pending</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardDescription>Departments</CardDescription>
                        <CardTitle className="text-3xl">
                            {
                                new Set(
                                    users
                                        .map((u) => u.department)
                                        .filter(Boolean),
                                ).size
                            }
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-gray-500">
                            Across all users
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Users */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Users</CardTitle>
                    <CardDescription>Latest registered users</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>School No.</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Department</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.slice(0, 5).map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">
                                        {user.firstName} {user.lastName}
                                    </TableCell>
                                    <TableCell>{user.schoolNumber}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">
                                            {user.role}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {user.department || "—"}
                                    </TableCell>
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
                                        colSpan={5}
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
        </div>
    );
};

export default AdminOverview;
