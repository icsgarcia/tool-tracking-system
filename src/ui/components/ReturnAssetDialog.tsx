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
    type MouseEvent,
    type SetStateAction,
} from "react";
import QrScan from "./QrScan";
import { useReturnAsset } from "@/hooks/useTransactions";
import { toast } from "sonner";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { AlertCircle, Camera, Undo2, QrCode, ScanLine, X } from "lucide-react";
import { Html5Qrcode } from "html5-qrcode";
import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
} from "./ui/combobox";
import { Field, FieldLabel } from "./ui/field";
import { Textarea } from "./ui/textarea";
import { useGetAssets } from "@/hooks/useAssets";

interface ReturnAssetDialogProps {
    user: User;
    openReturnDialog: boolean;
    setOpenReturnDialog: Dispatch<SetStateAction<boolean>>;
}

const ReturnAssetDialog = ({
    user,
    openReturnDialog,
    setOpenReturnDialog,
}: ReturnAssetDialogProps) => {
    const returnAsset = useReturnAsset();
    const isProcessing = useRef(false);
    const scannerRef = useRef<Html5Qrcode | null>(null);
    const [returnCount, setReturnCount] = useState(1);
    const [remarks, setRemarks] = useState("");
    const [code, setCode] = useState<string | null>("");
    const [device, setDevice] = useState<string>("");
    const [cameraError, setCameraError] = useState<string | null>(null);

    const { data: rawAssets = [] } = useGetAssets();

    const handleScan = useRef((scannedCode: string) => {
        if (isProcessing.current) return;
        isProcessing.current = true;

        // Stop camera if active
        const scanner = scannerRef.current;
        if (scanner) {
            scannerRef.current = null;
            scanner
                .stop()
                .then(() => scanner.clear())
                .catch(() => {});
        }

        setCode(scannedCode);
    });

    // Start/stop camera when device changes
    useEffect(() => {
        if (device !== "camera" || code) return;

        const scannerId = "return-camera-qr-reader";
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
                        handleScan.current(decodedText);
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
    }, [device, code]);

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

    const handleSwitchDevice = async (newDevice: string) => {
        await stopCamera();
        isProcessing.current = false;
        setCameraError(null);
        setDevice(newDevice);
    };

    const handleCancel = async () => {
        setCode("");
        setReturnCount(1);
        isProcessing.current = false;
    };

    const handleSubmit = (
        e: React.FormEvent<HTMLFormElement> | MouseEvent<HTMLButtonElement>,
    ) => {
        e.preventDefault();
        returnAsset.mutate(
            { userId: user.id, assetQrCode: code!, returnCount, remarks },
            {
                onSuccess: () => {
                    setOpenReturnDialog(false);
                    setCode("");
                    setReturnCount(1);
                    setDevice("");
                    isProcessing.current = false;
                },
                onError: (error) => {
                    toast.error(
                        error.message ||
                            "Returning Tool failed. Please try again.",
                    );
                    isProcessing.current = false;
                },
            },
        );
    };

    const handleCloseDialog = async () => {
        await stopCamera();
        setCode("");
        setReturnCount(1);
        setDevice("");
        setCameraError(null);
        isProcessing.current = false;
        setOpenReturnDialog(false);
    };

    return (
        <Dialog open={openReturnDialog} onOpenChange={handleCloseDialog}>
            <DialogContent className="max-w-md w-[calc(100%-2rem)] max-h-[85svh] flex flex-col gap-0 p-0 overflow-hidden">
                <DialogHeader className="shrink-0 px-4 pt-4 pb-2 sm:px-6 sm:pt-6">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                            <Undo2 className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <DialogTitle className="text-base sm:text-lg">
                                Return Tool
                            </DialogTitle>
                            <DialogDescription className="text-xs sm:text-sm">
                                Scan Tool's QR Code to return
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <Separator className="mx-4 sm:mx-6 w-auto" />

                <div className="flex-1 overflow-y-auto overscroll-contain px-4 pb-4 sm:px-6 sm:pb-6 pt-2">
                    {(device === "camera" || device === "qr") && code ? (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="flex items-center gap-3 rounded-lg border p-3 bg-muted/50">
                                <QrCode className="w-5 h-5 text-muted-foreground shrink-0" />
                                <div className="min-w-0">
                                    <p className="text-xs text-muted-foreground">
                                        Scanned QR Code
                                    </p>
                                    <p className="text-sm font-medium truncate">
                                        {code}
                                    </p>
                                </div>
                            </div>

                            <Field className="space-y-2">
                                <FieldLabel htmlFor="return-count">
                                    Quantity to Return
                                </FieldLabel>
                                <Input
                                    id="return-count"
                                    type="number"
                                    min={1}
                                    value={returnCount}
                                    onChange={(e) =>
                                        setReturnCount(Number(e.target.value))
                                    }
                                />
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="remarks">
                                    Message
                                </FieldLabel>
                                <Textarea
                                    id="remarks"
                                    value={remarks}
                                    onChange={(e) => setRemarks(e.target.value)}
                                    placeholder="GOOD, DAMAGED, BROKEN, LOST, etc..."
                                />
                            </Field>

                            <div className="flex justify-end gap-2 pt-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleCancel}
                                >
                                    <X className="w-4 h-4 mr-1" />
                                    Cancel
                                </Button>
                                <Button type="submit">
                                    <Undo2 className="w-4 h-4 mr-1" />
                                    Return Tool
                                </Button>
                            </div>
                        </form>
                    ) : (
                        <div className="flex flex-col items-center gap-4 py-6">
                            {/* Device Selection */}
                            {device === "" && (
                                <>
                                    <Button onClick={() => setDevice("camera")}>
                                        Use Camera
                                    </Button>
                                    <Button onClick={() => setDevice("qr")}>
                                        Use QR Scanner
                                    </Button>
                                    <Button onClick={() => setDevice("manual")}>
                                        Use Manual Input
                                    </Button>
                                </>
                            )}

                            {/* Camera Device */}
                            {device === "camera" && (
                                <>
                                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                                        <Camera className="w-6 h-6 text-primary" />
                                    </div>
                                    <div className="text-center space-y-1">
                                        <p className="text-sm font-medium">
                                            Scan Tool QR Code
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Position the tool's QR code in front
                                            of the camera
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
                                                id="return-camera-qr-reader"
                                                className="w-full"
                                            />
                                        </div>
                                    )}

                                    <Button
                                        variant="outline"
                                        onClick={() => handleSwitchDevice("")}
                                        className="block w-full"
                                    >
                                        Go Back
                                    </Button>
                                </>
                            )}

                            {/* QR Scanner Device */}
                            {device === "qr" && (
                                <>
                                    <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-primary/10">
                                        <ScanLine className="w-9 h-9 text-primary animate-pulse" />
                                    </div>
                                    <div className="text-center space-y-1">
                                        <p className="text-sm font-medium">
                                            Waiting for QR code scan...
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Place the tool's QR code in front of
                                            the scanner
                                        </p>
                                    </div>

                                    <QrScan
                                        handleScan={(c) =>
                                            handleScan.current(c)
                                        }
                                        className="opacity-0 pointer-events-none absolute"
                                    />

                                    <Button
                                        variant="outline"
                                        onClick={() => handleSwitchDevice("")}
                                        className="block w-full"
                                    >
                                        Go Back
                                    </Button>
                                </>
                            )}

                            {/* Manual Input */}
                            {device === "manual" && (
                                <>
                                    <div className="flex flex-col gap-3 w-full">
                                        <Field>
                                            <FieldLabel htmlFor="asset-name">
                                                Asset Name
                                            </FieldLabel>
                                            <Combobox
                                                id="asset-name"
                                                items={rawAssets}
                                                value={code}
                                                onValueChange={setCode}
                                            >
                                                <ComboboxInput placeholder="Type asset name..." />
                                                <ComboboxContent>
                                                    <ComboboxEmpty>
                                                        No assets found.
                                                    </ComboboxEmpty>
                                                    <ComboboxList>
                                                        {(item) => (
                                                            <ComboboxItem
                                                                key={item.label}
                                                                value={
                                                                    item.value
                                                                }
                                                            >
                                                                <div>
                                                                    <p className="font-medium">
                                                                        {
                                                                            item.label
                                                                        }
                                                                    </p>
                                                                </div>
                                                            </ComboboxItem>
                                                        )}
                                                    </ComboboxList>
                                                </ComboboxContent>
                                            </Combobox>
                                        </Field>
                                        <Field>
                                            <FieldLabel htmlFor="asset-quantity">
                                                Return Quantity
                                            </FieldLabel>
                                            <Input
                                                id="asset-quantity"
                                                type="number"
                                                placeholder="Enter return quantity"
                                                min={1}
                                                value={returnCount}
                                                onChange={(e) =>
                                                    setReturnCount(
                                                        Number(e.target.value),
                                                    )
                                                }
                                            />
                                        </Field>
                                        <Field>
                                            <FieldLabel htmlFor="remarks">
                                                Message
                                            </FieldLabel>
                                            <Textarea
                                                id="remarks"
                                                value={remarks}
                                                onChange={(e) =>
                                                    setRemarks(e.target.value)
                                                }
                                                placeholder="GOOD, DAMAGED, BROKEN, LOST, etc..."
                                            />
                                        </Field>
                                        <Field>
                                            <Button onClick={handleSubmit}>
                                                Return Asset
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={() =>
                                                    handleSwitchDevice("")
                                                }
                                            >
                                                Go Back
                                            </Button>
                                        </Field>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ReturnAssetDialog;
