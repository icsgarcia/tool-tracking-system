import type { Dispatch, SetStateAction } from "react";
import { Dialog, DialogContent } from "./ui/dialog";

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
            <DialogContent>
                <img src={qrCode.image} alt={qrCode.name} className="w-full" />
                <a
                    href={qrCode.image}
                    download={fileName}
                    className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-center"
                >
                    Download QR Code
                </a>
            </DialogContent>
        </Dialog>
    );
};

export default QrImageDialog;
