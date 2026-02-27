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
        <Button
            onClick={handlePrint}
            size="sm"
            className="shrink-0 sm:size-default"
        >
            <Printer className="h-4 w-4" />
            <span className="hidden sm:inline">Print</span>
        </Button>
    );
};

export default PrintButton;
