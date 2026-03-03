import type { Dispatch, SetStateAction } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import {
    User as UserIcon,
    Mail,
    Phone,
    GraduationCap,
    Building,
    Hash,
} from "lucide-react";

interface UserDetailDialogProps {
    openUserDetailDialog: boolean;
    setOpenUserDetailDialog: Dispatch<SetStateAction<boolean>>;
    user: User;
}

const UserDetailDialog = ({
    openUserDetailDialog,
    setOpenUserDetailDialog,
    user,
}: UserDetailDialogProps) => {
    const fullName = `${user.firstName} ${user.middleName} ${user.lastName}`
        .toLowerCase()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

    return (
        <Dialog
            open={openUserDetailDialog}
            onOpenChange={setOpenUserDetailDialog}
        >
            <DialogContent className="max-w-md w-[calc(100%-2rem)] max-h-[85svh] flex flex-col gap-0 p-0 overflow-hidden">
                <DialogHeader className="shrink-0 px-4 pt-4 pb-2 sm:px-6 sm:pt-6">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                            <UserIcon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <DialogTitle className="text-base sm:text-lg">
                                User Details
                            </DialogTitle>
                            <DialogDescription className="text-xs sm:text-sm">
                                {fullName}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <Separator className="mx-4 sm:mx-6 w-auto" />

                <div className="flex-1 overflow-y-auto overscroll-contain px-4 pb-4 sm:px-6 sm:pb-6 pt-2">
                    <div className="space-y-3">
                        <div className="flex items-center justify-center">
                            <img
                                src={user.qrCodeImage}
                                alt={fullName}
                                className="w-28 h-28 rounded-md border"
                            />
                        </div>

                        <div className="flex items-center gap-3 rounded-lg border p-3 bg-muted/50">
                            <Hash className="w-5 h-5 text-muted-foreground shrink-0" />
                            <div className="min-w-0">
                                <p className="text-xs text-muted-foreground">
                                    School Number
                                </p>
                                <p className="text-sm font-medium truncate">
                                    {user.schoolNumber}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 rounded-lg border p-3 bg-muted/50">
                            <UserIcon className="w-5 h-5 text-muted-foreground shrink-0" />
                            <div className="min-w-0">
                                <p className="text-xs text-muted-foreground">
                                    Full Name
                                </p>
                                <p className="text-sm font-medium truncate">
                                    {fullName}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 rounded-lg border p-3 bg-muted/50">
                            <Mail className="w-5 h-5 text-muted-foreground shrink-0" />
                            <div className="min-w-0">
                                <p className="text-xs text-muted-foreground">
                                    Email
                                </p>
                                <p className="text-sm font-medium truncate">
                                    {user.email && user.email !== "undefined"
                                        ? user.email
                                        : "—"}
                                </p>
                            </div>
                        </div>

                        {user.number && user.number !== "undefined" && (
                            <div className="flex items-center gap-3 rounded-lg border p-3 bg-muted/50">
                                <Phone className="w-5 h-5 text-muted-foreground shrink-0" />
                                <div className="min-w-0">
                                    <p className="text-xs text-muted-foreground">
                                        Contact Number
                                    </p>
                                    <p className="text-sm font-medium truncate">
                                        {user.number}
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-3">
                            <div className="flex items-center gap-3 rounded-lg border p-3 bg-muted/50">
                                <div className="min-w-0">
                                    <p className="text-xs text-muted-foreground">
                                        Role
                                    </p>
                                    <Badge variant="outline" className="mt-1">
                                        {user.role}
                                    </Badge>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 rounded-lg border p-3 bg-muted/50">
                                <div className="min-w-0">
                                    <p className="text-xs text-muted-foreground">
                                        Status
                                    </p>
                                    <Badge
                                        variant={
                                            user.status === "ACTIVE"
                                                ? "default"
                                                : "secondary"
                                        }
                                        className={
                                            user.status === "ACTIVE"
                                                ? "mt-1 bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800"
                                                : "mt-1"
                                        }
                                    >
                                        {user.status}
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="flex items-center gap-3 rounded-lg border p-3 bg-muted/50">
                                <Building className="w-5 h-5 text-muted-foreground shrink-0" />
                                <div className="min-w-0">
                                    <p className="text-xs text-muted-foreground">
                                        Department
                                    </p>
                                    <p className="text-sm font-medium truncate">
                                        {user.department || "—"}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 rounded-lg border p-3 bg-muted/50">
                                <GraduationCap className="w-5 h-5 text-muted-foreground shrink-0" />
                                <div className="min-w-0">
                                    <p className="text-xs text-muted-foreground">
                                        Year Level
                                    </p>
                                    <p className="text-sm font-medium truncate">
                                        {user.yearLevel}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default UserDetailDialog;
