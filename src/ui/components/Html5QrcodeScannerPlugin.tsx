import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";

const qrcodeRegionId = "html5qr-code-full-region";

interface Html5QrcodePluginProps {
    fps?: number;
    qrbox?: number;
    aspectRatio?: number;
    disableFlip?: boolean;
    verbose?: boolean;
    qrCodeSuccessCallback: (decodedText: string) => void;
    qrCodeErrorCallback?: (errorMessage: string) => void;
}

export interface Html5QrcodePluginRef {
    stop: () => void;
}

const Html5QrcodePlugin = forwardRef<
    Html5QrcodePluginRef,
    Html5QrcodePluginProps
>((props, ref) => {
    const scannerRef = useRef<Html5QrcodeScanner | null>(null);

    useImperativeHandle(ref, () => ({
        stop: () => {
            scannerRef.current?.clear().catch(console.error);
        },
    }));

    useEffect(() => {
        const config = {
            fps: props.fps ?? 10,
            qrbox: props.qrbox,
            aspectRatio: props.aspectRatio,
            disableFlip: props.disableFlip,
        };

        const verbose = props.verbose === true;

        const scanner = new Html5QrcodeScanner(qrcodeRegionId, config, verbose);
        scannerRef.current = scanner;

        scanner.render(props.qrCodeSuccessCallback, props.qrCodeErrorCallback);

        return () => {
            scanner.clear().catch((error) => {
                console.error("Failed to clear html5QrcodeScanner. ", error);
            });
        };
    }, []);

    return <div id={qrcodeRegionId} />;
});

export default Html5QrcodePlugin;
