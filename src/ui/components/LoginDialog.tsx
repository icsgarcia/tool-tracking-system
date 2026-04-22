import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    useEffect,
    useRef,
    useState,
    type Dispatch,
    type SetStateAction,
} from "react";
import QrScan from "./QrScan";
import { useNavigate } from "react-router";
import {
    useGetStudentAndStaff,
    useLoginBySchoolNumber,
    useScanUser,
} from "@/hooks/useUsers";
import { toast } from "sonner";
import { Separator } from "./ui/separator";
import { AlertCircle, Camera, LogIn, ScanLine } from "lucide-react";
import { Button } from "./ui/button";
import { Html5Qrcode } from "html5-qrcode";
import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
} from "./ui/combobox";
import { useUserStore } from "@/store/useUserStore";

interface LoginDialogProps {
    openLoginDialog: boolean;
    setOpenLoginDialog: Dispatch<SetStateAction<boolean>>;
}

const LoginDialog = ({
    openLoginDialog,
    setOpenLoginDialog,
}: LoginDialogProps) => {
    const navigate = useNavigate();
    const scanUser = useScanUser();
    const loginBySchoolNumber = useLoginBySchoolNumber();
    const userLogin = useUserStore((state) => state.login);
    const isProcessing = useRef(false);
    const scannerRef = useRef<Html5Qrcode | null>(null);
    const [scanningUser, setScanningUser] = useState(true);
    const [device, setDevice] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const [cameraError, setCameraError] = useState<string | null>(null);
    const [selectedSchoolNumber, setSelectedSchoolNumber] = useState<
        string | null
    >("");
    const { data: students = [] } = useGetStudentAndStaff();

    const handleScanUser = useRef((code: string) => {
        if (isProcessing.current) return;
        isProcessing.current = true;
        setError(null);

        scanUser.mutate(code, {
            onSuccess: (user) => {
                if (user.role !== "STUDENT" && user.role !== "STAFF") {
                    toast.error(
                        "Only STUDENT or STAFF users can be scanned here.",
                    );
                    setError(
                        "Only STUDENT or STAFF users can be scanned here.",
                    );
                    isProcessing.current = false;
                    return;
                }
                setScanningUser(false);
                userLogin(user);
                toast.success(
                    `Login successful! Welcome, ${user.firstName} ${user.lastName}`,
                );

                // Stop camera scanner if active
                const scanner = scannerRef.current;
                if (scanner) {
                    scannerRef.current = null;
                    scanner
                        .stop()
                        .then(() => scanner.clear())
                        .catch(() => {});
                }

                navigate("/dashboard");
            },
            onError: () => {
                toast.error("Login failed. Please check your QR/barcode.");
                setError("Login failed. Please check your QR/barcode.");
                isProcessing.current = false;
                setScanningUser(false);
                setTimeout(() => setScanningUser(true), 100);
            },
        });
    });

    // Start/stop camera scanner when device changes
    useEffect(() => {
        if (device !== "camera") return;

        const scannerId = "login-camera-qr-reader";
        let mounted = true;

        const startScanner = async () => {
            try {
                const scanner = new Html5Qrcode(scannerId);
                scannerRef.current = scanner;

                await scanner.start(
                    { facingMode: "environment" },
                    {
                        fps: 10,
                        qrbox: { width: 250, height: 250 },
                    },
                    (decodedText) => {
                        if (!mounted || isProcessing.current) return;
                        handleScanUser.current(decodedText);
                    },
                    () => {},
                );
            } catch (err) {
                if (mounted) {
                    setCameraError(
                        "Unable to access camera. Please check camera permissions.",
                    );
                }
                console.error("Camera error:", err);
            }
        };

        const timeout = setTimeout(startScanner, 100);

        return () => {
            mounted = false;
            clearTimeout(timeout);
            const scanner = scannerRef.current;
            if (scanner) {
                scannerRef.current = null;
                scanner
                    .stop()
                    .then(() => scanner.clear())
                    .catch(() => {});
            }
        };
    }, [device]);

    const stopCamera = async () => {
        const scanner = scannerRef.current;
        if (scanner) {
            scannerRef.current = null;
            try {
                await scanner.stop();
                scanner.clear();
            } catch {
                // ignore
            }
        }
    };

    // const handleSwitchDevice = async (newDevice: string) => {
    //     await stopCamera();
    //     isProcessing.current = false;
    //     setScanningUser(true);
    //     setError(null);
    //     setCameraError(null);
    //     setDevice(newDevice);
    // };

    const handleCloseDialog = async () => {
        await stopCamera();
        setDevice("");
        setError(null);
        setCameraError(null);
        setOpenLoginDialog(false);
    };

    const handleSubmit = () => {
        if (!selectedSchoolNumber) {
            toast.error("Please select a school number.");
            return;
        }

        loginBySchoolNumber.mutate(selectedSchoolNumber, {
            onSuccess: (user) => {
                userLogin(user);
                toast.success(
                    `Login successful! Welcome, ${user.firstName} ${user.lastName}`,
                );
                navigate("/dashboard");
            },
            onError: (error) => {
                toast.error(error.message);
            },
        });
    };

    return (
        <Dialog open={openLoginDialog} onOpenChange={handleCloseDialog}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                            <LogIn className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <DialogTitle>Student/Staff Login</DialogTitle>
                            <DialogDescription>
                                Scan Student's or Staff's QR Code to login
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <Separator />

                <div className="flex flex-col items-center gap-4 py-6">
                    {/* Device Selection */}
                    {device === "" && (
                        <>
                            <Button onClick={() => setDevice("camera")}>
                                Use Camera
                            </Button>
                            <Button onClick={() => setDevice("qrscanner")}>
                                Use QR Scanner
                            </Button>
                            <Button onClick={() => setDevice("manual")}>
                                Use Student or Staff Name
                            </Button>
                        </>
                    )}

                    {/* Camera Device */}
                    {device === "camera" && (
                        <>
                            <Button
                                variant="outline"
                                onClick={() => setDevice("")}
                            >
                                Go Back
                            </Button>

                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                                <Camera className="w-6 h-6 text-primary" />
                            </div>
                            <div className="text-center space-y-1">
                                <p className="text-sm font-medium">
                                    Scan Student/Staff QR Code
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Position the QR code in front of the camera
                                </p>
                            </div>

                            {cameraError ? (
                                <div className="flex items-center gap-2 w-full rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3">
                                    <AlertCircle className="w-4 h-4 text-destructive shrink-0" />
                                    <p className="text-sm text-destructive">
                                        {cameraError}
                                    </p>
                                </div>
                            ) : (
                                <div className="w-full overflow-hidden rounded-lg">
                                    <div
                                        id="login-camera-qr-reader"
                                        className="w-full"
                                    />
                                </div>
                            )}
                        </>
                    )}

                    {/* QR Scanner Device */}
                    {device === "qrscanner" && (
                        <>
                            <Button
                                variant="outline"
                                onClick={() => setDevice("")}
                            >
                                Go Back
                            </Button>
                            <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-primary/10">
                                <ScanLine className="w-9 h-9 text-primary animate-pulse" />
                            </div>
                            <div className="text-center space-y-1">
                                <p className="text-sm font-medium">
                                    Waiting for QR code scan...
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Place the student's or staff's QR code in
                                    front of the scanner
                                </p>
                            </div>

                            {scanningUser && (
                                <QrScan
                                    handleScan={(code) =>
                                        handleScanUser.current(code)
                                    }
                                    className="opacity-0 pointer-events-none absolute"
                                />
                            )}
                        </>
                    )}

                    {device === "manual" && (
                        <div className="w-full">
                            <Button
                                variant="outline"
                                onClick={() => setDevice("")}
                                className="block mx-auto"
                            >
                                Go Back
                            </Button>

                            <div className="flex flex-col gap-3 w-full">
                                <Combobox
                                    items={students}
                                    value={selectedSchoolNumber}
                                    onValueChange={setSelectedSchoolNumber}
                                >
                                    <ComboboxInput placeholder="Type school number or name..." />
                                    <ComboboxContent>
                                        <ComboboxEmpty>
                                            No student or staff found.
                                        </ComboboxEmpty>
                                        <ComboboxList>
                                            {(item) => (
                                                <ComboboxItem
                                                    key={item.value}
                                                    value={item.value}
                                                >
                                                    <div>
                                                        <p className="font-medium">
                                                            {item.label}
                                                        </p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {item.value}
                                                        </p>
                                                    </div>
                                                </ComboboxItem>
                                            )}
                                        </ComboboxList>
                                    </ComboboxContent>
                                </Combobox>

                                <Button
                                    onClick={handleSubmit}
                                    disabled={
                                        !selectedSchoolNumber ||
                                        loginBySchoolNumber.isPending
                                    }
                                >
                                    {loginBySchoolNumber.isPending
                                        ? "Logging in..."
                                        : "Login"}
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Error Display */}
                    {error && (
                        <div className="flex items-center gap-2 w-full rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3">
                            <AlertCircle className="w-4 h-4 text-destructive shrink-0" />
                            <p className="text-sm text-destructive">{error}</p>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default LoginDialog;
