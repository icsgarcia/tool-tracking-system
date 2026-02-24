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
        <div className="container mx-auto">
            <Header user={admin} handleLogout={handleLogout} />

            <Tabs defaultValue="overview">
                <TabsList variant="line">
                    {tabs.map((tab) => (
                        <TabsTrigger value={tab.id}>{tab.label}</TabsTrigger>
                    ))}
                </TabsList>

                <main>
                    <TabsContent value="overview">
                        <AdminOverview users={users} assets={assets} />
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
