import { useLocation, useNavigate } from "react-router";
import { useGetAllUsers } from "@/hooks/useUsers";
import { useGetAllAssets } from "@/hooks/useAssets";
import AboutUs from "@/components/AboutUs";
import TransactionsTable from "@/components/TransactionsTable";
import UsersTable from "@/components/UsersTable";
import AdminOverview from "@/components/AdminOverview";
import { toast } from "sonner";
import { useGetAllTransactions } from "@/hooks/useTransactions";
import NavUser from "@/components/NavUser";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AssetsTable from "@/components/AssetsTable";

export interface User {
    id: string;
    qrCode: string;
    qrCodeImage: string;
    schoolNumber: string;
    firstName: string;
    middleName: string;
    lastName: string;
    role: string;
    department: string;
    yearLevel: number;
    email: string;
    number?: string;
    status: string;
}

export interface Asset {
    id: string;
    temporaryTagNumber?: string;
    qrCode: string;
    qrCodeImage: string;
    assetName: string;
    assetDescription: string;
    serialNumber?: string;
    assetCategoryCode?: string;
    roomName?: string;
    locationCode?: string;
    assetCount: number;
    borrowedCount: number;
    availableCount: number;
    assetCondition?: string;
    remarks?: string;
}

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
            {/* Header */}
            <header className="border-b p-4">
                <div className="mx-auto flex max-w-7xl items-center justify-between">
                    <h1 className="text-xl font-bold">Asset Tracking System</h1>
                    <NavUser user={admin} onLogout={handleLogout} />
                </div>
            </header>

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
