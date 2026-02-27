import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { useGetAllUsers } from "@/hooks/useUsers";
import { useGetAllAssets } from "@/hooks/useAssets";
import AboutUs from "@/components/AboutUs";
import TransactionsTable from "@/components/TransactionsTable";
import UsersTable from "@/components/UsersTable";
import AdminOverview from "@/components/AdminOverview";
import { toast } from "sonner";
import { useGetAllTransactions } from "@/hooks/useTransactions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AssetsTable from "@/components/AssetsTable";
import Header from "@/components/Header";

const AdminDashboard = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const admin = location.state?.user;
    const { data: users = [] } = useGetAllUsers();
    const { data: assets = [] } = useGetAllAssets();
    const { data: transactions = [] } = useGetAllTransactions();

    useEffect(() => {
        if (!admin || admin.role !== "ADMIN") {
            navigate("/");
        }
    }, [admin, navigate]);

    if (!admin || admin.role !== "ADMIN") {
        return null;
    }

    const handleLogout = () => {
        toast.success("Logged out successfully.");
        navigate("/");
    };

    const tabs = [
        { id: "overview", label: "Overview" },
        { id: "users", label: "Users" },
        { id: "assets", label: "Assets" },
        { id: "transactions", label: "Transactions" },
        { id: "about", label: "About" },
    ];

    return (
        <div className="mx-auto max-w-7xl min-h-svh">
            <Header user={admin} handleLogout={handleLogout} />

            <Tabs defaultValue="overview" className="px-3 sm:px-4">
                {/* Scrollable tabs wrapper for small screens */}
                <div className="overflow-x-auto overflow-y-hidden -mx-3 px-3 sm:-mx-4 sm:px-4">
                    <TabsList variant="line" className="w-max min-w-full">
                        {tabs.map((tab) => (
                            <TabsTrigger
                                key={tab.id}
                                value={tab.id}
                                className="whitespace-nowrap text-sm sm:text-base after:bg-primary data-[state=active]:text-primary"
                            >
                                {tab.label}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </div>

                <main className="py-4 sm:py-6">
                    <TabsContent value="overview">
                        <AdminOverview
                            admin={admin}
                            users={users}
                            assets={assets}
                        />
                    </TabsContent>
                    <TabsContent value="users">
                        <UsersTable users={users} />
                    </TabsContent>
                    <TabsContent value="assets">
                        <AssetsTable assets={assets} />
                    </TabsContent>
                    <TabsContent value="transactions">
                        <TransactionsTable transactions={transactions} />
                    </TabsContent>
                    <TabsContent value="about">
                        <AboutUs />
                    </TabsContent>
                </main>
            </Tabs>
        </div>
    );
};

export default AdminDashboard;
