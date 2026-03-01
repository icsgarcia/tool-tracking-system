import { Printer } from "lucide-react";
import { Button } from "./ui/button";
import { useReactToPrint } from "react-to-print";
import type { RefObject } from "react";

interface PrintButtonProps {
    contentRef: RefObject<HTMLDivElement | null>;
}

async function convertImagesToBase64(doc: Document) {
    const images = doc.querySelectorAll("img");
    await Promise.all(
        Array.from(images).map(async (img) => {
            const src = img.getAttribute("src");
            if (!src || src.startsWith("data:")) return;
            try {
                const response = await fetch(src);
                const blob = await response.blob();
                const dataUrl = await new Promise<string>((resolve) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result as string);
                    reader.readAsDataURL(blob);
                });
                img.setAttribute("src", dataUrl);
            } catch {
                // leave image as-is if fetch fails
            }
        }),
    );
}

function injectPrintStyles(doc: Document) {
    const style = doc.createElement("style");
    style.textContent = `
        @page {
            size: landscape;
            margin: 10mm;
        }
        * {
            box-sizing: border-box;
        }
        body {
            margin: 0;
            padding: 0;
            font-size: 11px;
        }
        table {
            width: 100% !important;
            table-layout: fixed !important;
            border-collapse: collapse;
            word-wrap: break-word;
            overflow-wrap: break-word;
        }
        th, td {
            padding: 4px 6px !important;
            font-size: 11px !important;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        img {
            max-width: 40px !important;
            height: auto !important;
        }
        .print\\:hidden {
            display: none !important;
        }
    `;
    doc.head.appendChild(style);
}

const PrintButton = ({ contentRef }: PrintButtonProps) => {
    const handlePrint = useReactToPrint({
        contentRef: contentRef,
        print: async (iframe) => {
            if (!iframe.contentWindow) return;
            await convertImagesToBase64(iframe.contentWindow.document);
            injectPrintStyles(iframe.contentWindow.document);
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
