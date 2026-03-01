import { useRef, type Dispatch, type SetStateAction } from "react";
import { Card, CardContent } from "./ui/card";
import PrintButton from "./PrintButton";
import { Dialog, DialogContent } from "./ui/dialog";

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
            <DialogContent>
                <Card
                    ref={contentRef}
                    className="relative max-w-xl mx-auto bg-transparent rounded-xl shadow-none border-none overflow-hidden"
                >
                    <div className="absolute right-2 top-2 print:hidden">
                        <PrintButton contentRef={contentRef} />
                    </div>
                    <CardContent>
                        <div className="flex flex-col items-center gap-4 p-4 sm:gap-6 sm:p-6 md:flex-row md:items-start print:flex-row print:items-start">
                            <div className="flex flex-row items-center gap-4 md:flex-col print:flex-col">
                                <img
                                    src="/no_user_image.png"
                                    alt="user-display-photo"
                                    className="w-16 h-16 sm:w-24 sm:h-24 rounded-full border-2 border-border object-cover shadow-sm"
                                />
                                <img
                                    src={user.qrCodeImage}
                                    alt="user-qr-code"
                                    className="w-14 h-14 sm:w-20 sm:h-20 border-2 border-dashed border-muted-foreground/40 bg-muted rounded-lg object-contain"
                                />
                            </div>

                            <div className="flex flex-col flex-1 gap-3 w-full min-w-0 text-center md:text-left print:text-left">
                                <div>
                                    <p className="font-bold text-xl sm:text-2xl text-foreground mb-0.5 truncate">
                                        {user.lastName}
                                    </p>
                                    <p className="font-semibold text-base sm:text-lg text-muted-foreground mb-0.5 truncate">
                                        {user.firstName}{" "}
                                        {user.middleName
                                            ? `${user.middleName.charAt(0)}.`
                                            : ""}
                                    </p>
                                    <p className="italic text-sm text-muted-foreground mb-2">
                                        {user.schoolNumber}
                                    </p>
                                    <span className="inline-block bg-primary/10 text-primary text-xs px-3 py-1 rounded-full font-medium">
                                        {user.department} - {user.yearLevel}
                                    </span>
                                </div>

                                <div className="flex flex-col gap-1 text-muted-foreground text-sm">
                                    <p className="min-w-0">
                                        <span className="font-medium text-foreground">
                                            Email:
                                        </span>{" "}
                                        <span className="break-all">
                                            {user.email ?? "N/A"}
                                        </span>
                                    </p>
                                    <p>
                                        <span className="font-medium text-foreground">
                                            Phone:
                                        </span>{" "}
                                        {user.number ?? "N/A"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </DialogContent>
        </Dialog>
    );
};

export default ProfileDialog;
