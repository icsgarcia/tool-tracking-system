import { useState, type Dispatch, type SetStateAction } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "./ui/dialog";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { UserCircle, Mail, Phone, QrCode, FileDown, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ProfileDialogProps {
    user: User;
    openProfileDialog: boolean;
    setOpenProfileDialog: Dispatch<SetStateAction<boolean>>;
}

const ProfileDialog = ({
    user,
    openProfileDialog,
    setOpenProfileDialog,
}: ProfileDialogProps) => {
    const [exporting, setExporting] = useState(false);

    const handleExportProfile = async () => {
        setExporting(true);
        try {
            const html = `<!DOCTYPE html>
<html><head><style>
    body { font-family: Arial, sans-serif; padding: 40px; max-width: 500px; margin: 0 auto; }
    h1 { font-size: 22px; margin-bottom: 4px; }
    .subtitle { color: #666; font-size: 13px; margin-bottom: 20px; }
    .field { padding: 10px 14px; border: 1px solid #ddd; border-radius: 8px; margin-bottom: 8px; }
    .label { font-size: 11px; color: #888; }
    .value { font-size: 14px; font-weight: 500; }
    .badge { display: inline-block; padding: 2px 10px; border-radius: 10px; font-size: 12px; border: 1px solid #ddd; margin-right: 6px; }
    .badges { margin-bottom: 16px; }
    .qr { text-align: center; margin-top: 16px; }
    .qr img { width: 120px; height: 120px; border: 1px solid #ddd; border-radius: 8px; }
</style></head><body>
    <h1>${user.firstName} ${user.middleName ? `${user.middleName.charAt(0)}.` : ""} ${user.lastName}</h1>
    <p class="subtitle">${user.schoolNumber}</p>
    <div class="badges">
        <span class="badge">${user.role}</span>
        <span class="badge">${user.department} - ${user.yearLevel}</span>
    </div>
    <div class="field"><p class="label">Email</p><p class="value">${user.email ?? "N/A"}</p></div>
    <div class="field"><p class="label">Phone</p><p class="value">${user.number ?? "N/A"}</p></div>
    <div class="qr"><p class="label">QR Code</p><img src="${user.qrCodeImage}" alt="QR Code" /></div>
</body></html>`;
            const result = await window.api.print.exportPdf(
                html,
                `${user.lastName}-${user.firstName}-profile.pdf`,
            );
            if (result.success) {
                toast.success("Profile exported successfully.");
            }
        } catch {
            toast.error("Failed to export profile.");
        } finally {
            setExporting(false);
        }
    };

    return (
        <Dialog open={openProfileDialog} onOpenChange={setOpenProfileDialog}>
            <DialogContent className="max-w-md w-[calc(100%-2rem)] max-h-[85svh] flex flex-col gap-0 p-0 overflow-hidden">
                <DialogHeader className="shrink-0 px-4 pt-4 pb-2 sm:px-6 sm:pt-6">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                            <UserCircle className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <DialogTitle className="text-base sm:text-lg">
                                User Profile
                            </DialogTitle>
                            <DialogDescription className="text-xs sm:text-sm">
                                Account details and information
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <Separator className="mx-4 sm:mx-6 w-auto" />

                <div className="flex-1 overflow-y-auto overscroll-contain px-4 pb-4 sm:px-6 sm:pb-6 pt-2">
                    <Card
                        className="bg-transparent rounded-xl shadow-none border-none overflow-hidden"
                    >
                        <CardContent className="p-0">
                            <div className="flex flex-col items-center gap-4 sm:gap-5">
                                <div className="flex flex-col items-center gap-3">
                                    <img
                                        src="./no_user_image.png"
                                        alt="user-display-photo"
                                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-border object-cover shadow-sm"
                                    />
                                    <div className="text-center">
                                        <p className="font-bold text-xl sm:text-2xl text-foreground truncate">
                                            {user.firstName}{" "}
                                            {user.middleName
                                                ? `${user.middleName.charAt(0)}.`
                                                : ""}{" "}
                                            {user.lastName}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {user.schoolNumber}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline">
                                            {user.role}
                                        </Badge>
                                        <Badge className="bg-primary/10 text-primary border-transparent">
                                            {user.department} - {user.yearLevel}
                                        </Badge>
                                    </div>
                                </div>

                                <Separator />

                                <div className="w-full space-y-3">
                                    <div className="flex items-center gap-3 rounded-lg border p-3 bg-muted/50">
                                        <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
                                        <div className="min-w-0">
                                            <p className="text-xs text-muted-foreground">
                                                Email
                                            </p>
                                            <p className="text-sm font-medium truncate">
                                                {user.email ?? "N/A"}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 rounded-lg border p-3 bg-muted/50">
                                        <Phone className="w-4 h-4 text-muted-foreground shrink-0" />
                                        <div className="min-w-0">
                                            <p className="text-xs text-muted-foreground">
                                                Phone
                                            </p>
                                            <p className="text-sm font-medium truncate">
                                                {user.number ?? "N/A"}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 rounded-lg border p-3 bg-muted/50 w-full">
                                    <QrCode className="w-4 h-4 text-muted-foreground shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-muted-foreground">
                                            QR Code
                                        </p>
                                    </div>
                                    <img
                                        src={user.qrCodeImage}
                                        alt="user-qr-code"
                                        className="w-14 h-14 border border-border rounded-md object-contain bg-white"
                                    />
                                </div>

                                <div>
                                    <Button
                                        onClick={handleExportProfile}
                                        disabled={exporting}
                                        size="sm"
                                    >
                                        {exporting ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <FileDown className="h-4 w-4" />
                                        )}
                                        {exporting
                                            ? "Exporting..."
                                            : "Export PDF"}
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ProfileDialog;
