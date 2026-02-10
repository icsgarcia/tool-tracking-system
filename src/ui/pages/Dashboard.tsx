import { useLocation, useNavigate } from "react-router";

const Dashboard = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const user = location.state?.user;

    if (!user) {
        return (
            <div className="flex min-h-svh flex-col items-center justify-center gap-4">
                <p className="text-gray-500">
                    No user data. Please scan your QR code.
                </p>
                <button
                    className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                    onClick={() => navigate("/")}
                >
                    Go to Login
                </button>
            </div>
        );
    }

    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6">
            <h1 className="text-2xl font-bold">
                Welcome, {user.firstName} {user.lastName}!
            </h1>

            <div className="w-full max-w-md rounded-lg border p-6 shadow">
                <div className="space-y-3">
                    <p>
                        <span className="font-semibold">School Number:</span>{" "}
                        {user.schoolNumber}
                    </p>
                    <p>
                        <span className="font-semibold">Name:</span>{" "}
                        {user.firstName} {user.middleName} {user.lastName}
                    </p>
                    <p>
                        <span className="font-semibold">Role:</span> {user.role}
                    </p>
                    <p>
                        <span className="font-semibold">Department:</span>{" "}
                        {user.department}
                    </p>
                    <p>
                        <span className="font-semibold">Year Level:</span>{" "}
                        {user.yearLevel}
                    </p>
                    <p>
                        <span className="font-semibold">Email:</span>{" "}
                        {user.email}
                    </p>
                    {user.number && (
                        <p>
                            <span className="font-semibold">Contact:</span>{" "}
                            {user.number}
                        </p>
                    )}
                    <p>
                        <span className="font-semibold">Status:</span>{" "}
                        {user.status}
                    </p>
                </div>
            </div>

            <button
                className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
                onClick={() => navigate("/")}
            >
                Logout
            </button>
        </div>
    );
};

export default Dashboard;
