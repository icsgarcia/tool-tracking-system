import { HashRouter, Routes, Route } from "react-router";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";

const queryClient = new QueryClient();

function App() {
    return (
        <>
            <QueryClientProvider client={queryClient}>
                <HashRouter>
                    <Routes>
                        <Route path="/" element={<Login />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/admin" element={<AdminDashboard />} />
                    </Routes>
                </HashRouter>
            </QueryClientProvider>
            <Toaster richColors />
        </>
    );
}

export default App;
