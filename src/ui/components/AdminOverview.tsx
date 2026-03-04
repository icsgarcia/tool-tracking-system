import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "./ui/card";
import { useState } from "react";
import LoginDialog from "./LoginDialog";
import { Users, Package, ArrowLeftRight, LogIn } from "lucide-react";
import { useGetTotalUsers } from "@/hooks/useUsers";
import { useGetTotalAssets } from "@/hooks/useAssets";
import { useGetTotalTransactions } from "@/hooks/useTransactions";

interface AdminOverviewProps {
    admin: User;
}

const AdminOverview = ({ admin }: AdminOverviewProps) => {
    const { data: totalUsersData } = useGetTotalUsers();
    const { data: totalAssetsData } = useGetTotalAssets();
    const { data: totalTransactionsData } = useGetTotalTransactions();
    const [openLoginDialog, setOpenLoginDialog] = useState(false);

    const totalUsers = totalUsersData?.totalUsers ?? 0;
    const totalActiveUsers = totalUsersData?.totalActiveUsers ?? 0;
    const totalAssets = totalAssetsData?.totalAssets ?? 0;
    const totalQuantity = totalAssetsData?.totalQuantity ?? 0;
    const totalTransactions = totalTransactionsData?.totalTransactions ?? 0;
    const totalPendingTransactions =
        totalTransactionsData?.totalPendingTransactions ?? 0;

    return (
        <>
            <div className="flex flex-col gap-4 mt-4 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-4">
                    <Card className="border-l-4 border-l-primary">
                        <CardHeader className="p-4 sm:p-6">
                            <div className="flex items-center justify-between">
                                <CardDescription className="text-xs sm:text-sm">
                                    Total Users
                                </CardDescription>
                                <div className="flex items-center justify-center w-9 h-9 rounded-full bg-primary/10">
                                    <Users className="w-4 h-4 text-primary" />
                                </div>
                            </div>
                            <CardTitle className="text-2xl sm:text-3xl text-primary">
                                {totalUsers}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6 pt-0">
                            <p className="text-xs text-muted-foreground">
                                <span className="font-medium text-green-600 dark:text-green-400">
                                    {totalActiveUsers} active
                                </span>{" "}
                                / {totalUsers} total
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-primary/70">
                        <CardHeader className="p-4 sm:p-6">
                            <div className="flex items-center justify-between">
                                <CardDescription className="text-xs sm:text-sm">
                                    Total Tools
                                </CardDescription>
                                <div className="flex items-center justify-center w-9 h-9 rounded-full bg-primary/10">
                                    <Package className="w-4 h-4 text-primary" />
                                </div>
                            </div>
                            <CardTitle className="text-2xl sm:text-3xl text-primary">
                                {totalAssets}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6 pt-0">
                            <p className="text-xs text-muted-foreground">
                                <span className="font-medium">
                                    {totalQuantity}
                                </span>{" "}
                                total quantity
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-primary/50">
                        <CardHeader className="p-4 sm:p-6">
                            <div className="flex items-center justify-between">
                                <CardDescription className="text-xs sm:text-sm">
                                    Transactions
                                </CardDescription>
                                <div className="flex items-center justify-center w-9 h-9 rounded-full bg-primary/10">
                                    <ArrowLeftRight className="w-4 h-4 text-primary" />
                                </div>
                            </div>
                            <CardTitle className="text-2xl sm:text-3xl text-primary">
                                {totalTransactions}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6 pt-0">
                            <p className="text-xs text-muted-foreground">
                                <span className="font-medium text-amber-600 dark:text-amber-400">
                                    {totalPendingTransactions} pending
                                </span>{" "}
                                / {totalTransactions - totalPendingTransactions}{" "}
                                completed
                            </p>
                        </CardContent>
                    </Card>

                    <Card
                        onClick={() => setOpenLoginDialog(true)}
                        className="border-l-4 border-l-primary/30 cursor-pointer hover:bg-accent transition-colors"
                    >
                        <CardHeader className="p-4 sm:p-6">
                            <div className="flex items-center justify-between">
                                <CardDescription className="text-xs sm:text-sm">
                                    Login
                                </CardDescription>
                                <div className="flex items-center justify-center w-9 h-9 rounded-full bg-primary/10">
                                    <LogIn className="w-4 h-4 text-primary" />
                                </div>
                            </div>
                            <CardTitle className="text-2xl sm:text-3xl text-primary">
                                Student/Staff Login
                            </CardTitle>
                        </CardHeader>
                    </Card>
                </div>
            </div>
            <LoginDialog
                admin={admin}
                openLoginDialog={openLoginDialog}
                setOpenLoginDialog={setOpenLoginDialog}
            />
        </>
    );
};

export default AdminOverview;
