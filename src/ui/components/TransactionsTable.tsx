import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "./ui/card";

const TransactionsTable = () => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Transactions</CardTitle>
                <CardDescription>
                    Tool borrowing and return history
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                    <p className="text-lg font-medium">No transactions yet</p>
                    <p className="text-sm">
                        Transactions will appear here when users borrow or
                        return tools.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
};

export default TransactionsTable;
