import { Printer } from "lucide-react";
import { Button } from "./ui/button";
import { useReactToPrint } from "react-to-print";
import type { RefObject } from "react";

interface PrintButtonProps {
    contentRef: RefObject<HTMLDivElement | null>;
}

const PrintButton = ({ contentRef }: PrintButtonProps) => {
    const handlePrint = useReactToPrint({
        contentRef: contentRef,
        print: async (iframe) => {
            if (!iframe.contentWindow) return;
            const html =
                iframe.contentWindow.document.documentElement.outerHTML;
            await window.api.print.printComponent(html);
        },
    });

    return (
        <Button onClick={handlePrint}>
            <Printer /> Print
        </Button>
    );
};

export default PrintButton;
