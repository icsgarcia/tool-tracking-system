import type { Dispatch, SetStateAction } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";

interface QrImageDialogType {
    open: boolean;
    onOpenChange: Dispatch<SetStateAction<boolean>>;
    qrCode: {
        name: string;
        image: string;
    };
}

const QrImageDialog = ({ open, onOpenChange, qrCode }: QrImageDialogType) => {
    const fileName = `${qrCode.name.replace(/\s+/g, "_")}_QRCode.png`;
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-sm w-[calc(100%-2rem)] max-h-[85svh] flex flex-col gap-0 p-0 overflow-hidden">
                <DialogHeader className="shrink-0 px-4 pt-4 pb-2 sm:px-6 sm:pt-6">
                    <DialogTitle className="text-base sm:text-lg">
                        {qrCode.name}
                    </DialogTitle>
                    <DialogDescription className="text-xs sm:text-sm">
                        Preview and download the QR code.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-4 px-4 pb-4 sm:px-6 sm:pb-6">
                    <img
                        src={qrCode.image}
                        alt={`QR Code for ${qrCode.name}`}
                        className="w-full max-h-[50svh] object-contain rounded-md border"
                    />
                    <Button asChild className="w-full">
                        <a href={qrCode.image} download={fileName}>
                            Download QR Code
                        </a>
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default QrImageDialog;
