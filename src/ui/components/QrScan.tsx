import { useEffect, useRef, useState } from "react";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";

interface QrScanProps {
    handleScan: (code: string) => void;
    className?: string;
}

const QrScan = ({ handleScan, className }: QrScanProps) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [inputValue, setInputValue] = useState("");

    useEffect(() => {
        // Defer focus so it runs after any parent event (e.g. tab click)
        // finishes processing — otherwise the tab trigger steals focus back.
        const timer = setTimeout(() => {
            inputRef.current?.focus();
        }, 0);
        return () => clearTimeout(timer);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && inputValue.trim() !== "") {
            handleScan(inputValue.trim());
            setInputValue("");
        }
    };

    return (
        <Input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            className={cn("w-full max-w-md text-lg", className)}
            placeholder="Scan your QR code here"
        />
    );
};

export default QrScan;
