import { useRef, type Dispatch, type SetStateAction } from "react";
import { Card, CardContent } from "./ui/card";
import PrintButton from "./PrintButton";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "./ui/dialog";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { UserCircle, Mail, Phone, QrCode } from "lucide-react";

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
    const contentRef = useRef<HTMLDivElement>(null);

    return (
        <Dialog open={openProfileDialog} onOpenChange={setOpenProfileDialog}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                            <UserCircle className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <DialogTitle>User Profile</DialogTitle>
                            <DialogDescription>
                                Account details and information
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <Separator />

                <Card
                    ref={contentRef}
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
                                    <Badge variant="outline">{user.role}</Badge>
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

                            <div className="print:hidden">
                                <PrintButton contentRef={contentRef} />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </DialogContent>
        </Dialog>
    );
};

export default ProfileDialog;
