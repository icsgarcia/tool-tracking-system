import { useEffect } from "react";
import { useNavigate } from "react-router";
import AboutUs from "@/components/AboutUs";
import TransactionsTable from "@/components/TransactionsTable";
import UsersTable from "@/components/UsersTable";
import AdminOverview from "@/components/AdminOverview";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AssetsTable from "@/components/AssetsTable";
import BackupRestore from "@/components/BackupRestore";
import Header from "@/components/Header";
import { useAdminStore } from "@/store/useAdminStore";

const AdminDashboard = () => {
    const navigate = useNavigate();
    const admin = useAdminStore((state) => state.admin);

    useEffect(() => {
        if (
            !admin ||
            (admin.role !== "ADMIN" && admin.role !== "SUPER_ADMIN")
        ) {
            navigate("/");
        }
    }, [admin, navigate]);

    if (!admin) return null;

    const tabs = [
        { id: "overview", label: "Overview" },
        { id: "users", label: "Users" },
        { id: "tools", label: "Tools" },
        { id: "transactions", label: "Transactions" },
        { id: "backup", label: "Backup & Restore" },
        { id: "about", label: "About" },
    ];

    return (
        <div className="mx-auto max-w-7xl min-h-svh">
            <Header />

            <Tabs defaultValue="overview" className="px-3 sm:px-4">
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
                        <AdminOverview admin={admin!} />
                    </TabsContent>
                    <TabsContent value="users">
                        <UsersTable />
                    </TabsContent>
                    <TabsContent value="tools">
                        <AssetsTable />
                    </TabsContent>
                    <TabsContent value="transactions">
                        <TransactionsTable />
                    </TabsContent>
                    <TabsContent value="backup">
                        <BackupRestore />
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
