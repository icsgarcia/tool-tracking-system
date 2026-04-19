import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import CameraDialog from "@/components/CameraDialog";
import QRScannerDialog from "@/components/QRScannerDialog";
import ManualLogin from "@/components/auth/ManualLogin";

const Login = () => {
    // const [openCamera, setOpenCamera] = useState<boolean>(false);
    // const [openQrScannner, setOpenQrScannner] = useState<boolean>(false);
    const [loginMethod, setLoginMethod] = useState<string | null>(null);

    return (
        <div className="flex min-h-svh flex-col items-center justify-center p-4 sm:p-6 bg-muted/30">
            <Card className="max-w-md w-full shadow-lg border-none">
                <CardContent className="flex flex-col items-center gap-5 sm:gap-6 p-6 sm:p-10">
                    <img
                        src="./toolkeeper-logos/final-logo.png"
                        alt="tool-keeper-logo"
                        className="w-48 sm:w-64 lg:w-72 h-auto"
                    />

                    <Separator />

                    <div className="flex flex-col items-center gap-3">
                        {/* <Button onClick={() => setOpenCamera(true)}>
                            Use Camera
                        </Button>
                        <Button onClick={() => setOpenQrScannner(true)}>
                            Use QR Scanner
                        </Button> */}
                        <Button onClick={() => setLoginMethod("camera")}>
                            Use Camera
                        </Button>
                        <Button onClick={() => setLoginMethod("qr")}>
                            Use QR Scanner
                        </Button>
                        <Button onClick={() => setLoginMethod("password")}>
                            Use Password
                        </Button>
                    </div>

                    <div className="flex items-center gap-2 rounded-lg border p-3 bg-muted/50 w-full">
                        <ShieldAlert className="w-4 h-4 text-muted-foreground shrink-0" />
                        <p className="text-xs text-muted-foreground">
                            Admin access only. Student and staff login is
                            available after admin authentication.
                        </p>
                    </div>
                </CardContent>
            </Card>

            {loginMethod === "camera" && (
                <CameraDialog open={loginMethod} setOpen={setLoginMethod} />
            )}
            {loginMethod === "qr" && (
                <QRScannerDialog open={loginMethod} setOpen={setLoginMethod} />
            )}
            {loginMethod === "password" && (
                <ManualLogin open={loginMethod} setOpen={setLoginMethod} />
            )}
        </div>
    );
};

export default Login;
