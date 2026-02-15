import type { Transactions } from "@/types/transactions";
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
import { Badge } from "./ui/badge";

const TransactionsTable = ({
    transactions,
}: {
    transactions: Transactions[];
}) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Transactions</CardTitle>
                <CardDescription>
                    Tool borrowing and return history
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>User Name</TableHead>
                            <TableHead>Tool Name</TableHead>
                            <TableHead>Borrowed At</TableHead>
                            <TableHead>Returned At</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {transactions.map((transaction) => (
                            <TableRow key={transaction.id}>
                                <TableCell>{transaction.id}</TableCell>
                                <TableCell>{`${transaction.user.firstName} ${transaction.user.lastName}`}</TableCell>
                                <TableCell>{transaction.tool.name}</TableCell>
                                <TableCell>{transaction.borrowedAt}</TableCell>
                                <TableCell>{transaction.returnedAt}</TableCell>
                                <TableCell>
                                    <Badge variant="outline">
                                        {transaction.status}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                        {transactions.length === 0 && (
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
    );
};

export default TransactionsTable;
