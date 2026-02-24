import { useEffect, useRef, useState } from "react";

interface QrScanProps {
    handleScan: (code: string) => void;
    className?: string;
}

const QrScan = ({ handleScan, className }: QrScanProps) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [inputValue, setInputValue] = useState("");

    useEffect(() => {
        inputRef.current?.focus();
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
        <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            className={`w-full max-w-md border rounded px-4 py-2 text-lg ${className || ""}`}
            placeholder="Scan your QR code here"
            autoFocus
        />
    );
};

export default QrScan;
