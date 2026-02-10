import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useUsers } from "@/hooks/useUsers";
import { useTools } from "@/hooks/useTools";
import AboutUs from "@/components/AboutUs";
import TransactionsTable from "@/components/TransactionsTable";
import ToolsTable from "@/components/ToolsTable";
import UsersTable from "@/components/UsersTable";
import AdminOverview from "@/components/AdminOverview";

export interface User {
    id: string;
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

export interface Tool {
    id: string;
    qrCode: string;
    name: string;
    quantity: number;
}

const AdminDashboard = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const admin = location.state?.user;
    const { data: users = [], isLoading: usersLoading } = useUsers();
    const { data: tools = [], isLoading: toolsLoading } = useTools();
    const [activeTab, setActiveTab] = useState<string>("overview");

    const handleLogout = () => {
        navigate("/");
    };

    const tabs = [
        { id: "overview", label: "Overview" },
        { id: "users", label: "Users" },
        { id: "tools", label: "Tools" },
        { id: "transactions", label: "Transactions" },
        { id: "about", label: "About" },
    ];

    return (
        <div className="min-h-screen w-full bg-gray-50">
            {/* Header */}
            <header className="border-b bg-white px-6 py-4">
                <div className="mx-auto flex max-w-7xl items-center justify-between">
                    <h1 className="text-xl font-bold">Asset Tracking System</h1>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3">
                            <Avatar>
                                <AvatarFallback>
                                    {admin?.firstName?.[0] ?? "A"}
                                    {admin?.lastName?.[0] ?? "D"}
                                </AvatarFallback>
                            </Avatar>
                            <div className="hidden sm:block">
                                <p className="text-sm font-medium">
                                    {admin
                                        ? `${admin.firstName} ${admin.lastName}`
                                        : "Admin"}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {admin?.role ?? "ADMIN"}
                                </p>
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleLogout}
                        >
                            Logout
                        </Button>
                    </div>
                </div>
            </header>

            {/* Navigation Tabs */}
            <nav className="border-b bg-white px-6">
                <div className="mx-auto flex max-w-7xl gap-1">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-3 text-sm font-medium transition-colors ${
                                activeTab === tab.id
                                    ? "border-b-2 border-blue-500 text-blue-600"
                                    : "text-gray-500 hover:text-gray-700"
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </nav>

            {/* Main Content */}
            <main className="mx-auto max-w-7xl p-6">
                {activeTab === "overview" && (
                    <AdminOverview users={users} tools={tools} />
                )}

                {activeTab === "users" && <UsersTable users={users} />}

                {activeTab === "tools" && <ToolsTable tools={tools} />}

                {activeTab === "transactions" && <TransactionsTable />}

                {activeTab === "about" && <AboutUs />}
            </main>
        </div>
    );
};

export default AdminDashboard;
