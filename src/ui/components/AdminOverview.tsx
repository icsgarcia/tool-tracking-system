import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "./ui/card";
import { useState } from "react";
import LoginDialog from "./LoginDialog";

interface AdminOverviewType {
    admin: User;
    users: User[];
    assets: Asset[];
    transactions: Transactions[];
}

const AdminOverview = ({
    admin,
    users,
    assets,
    transactions,
}: AdminOverviewType) => {
    const [openLoginDialog, setOpenLoginDialog] = useState(false);

    return (
        <>
            <div className="flex flex-col gap-4 mt-4 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-4">
                    <Card className="border-l-4 border-l-primary">
                        <CardHeader className="p-4 sm:p-6">
                            <CardDescription className="text-xs sm:text-sm">
                                Total Users
                            </CardDescription>
                            <CardTitle className="text-2xl sm:text-3xl text-primary">
                                {users.length}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6 pt-0">
                            <p className="text-xs text-muted-foreground">
                                {
                                    users.filter((u) => u.status === "ACTIVE")
                                        .length
                                }{" "}
                                active
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-primary/70">
                        <CardHeader className="p-4 sm:p-6">
                            <CardDescription className="text-xs sm:text-sm">
                                Total Assets
                            </CardDescription>
                            <CardTitle className="text-2xl sm:text-3xl text-primary">
                                {assets.length}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6 pt-0">
                            <p className="text-xs text-muted-foreground">
                                {assets.reduce(
                                    (sum, t) => sum + t.assetCount,
                                    0,
                                )}{" "}
                                total quantity
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-primary/50">
                        <CardHeader className="p-4 sm:p-6">
                            <CardDescription className="text-xs sm:text-sm">
                                Transactions
                            </CardDescription>
                            <CardTitle className="text-2xl sm:text-3xl text-primary">
                                {transactions.length}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6 pt-0">
                            <p className="text-xs text-muted-foreground">
                                {
                                    transactions.filter(
                                        (t) =>
                                            t.status === "BORROWED" ||
                                            t.status === "UNRETURNED",
                                    ).length
                                }{" "}
                                pending
                            </p>
                        </CardContent>
                    </Card>

                    <Card
                        onClick={() => setOpenLoginDialog(true)}
                        className="border-l-4 border-l-primary/30 cursor-pointer hover:bg-accent transition-colors"
                    >
                        <CardHeader className="p-4 sm:p-6">
                            <CardDescription className="text-xs sm:text-sm">
                                Login
                            </CardDescription>
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
