import { useEffect, useRef, useState } from "react";

interface QrScanProps {
    handleScan: (code: string) => void;
}

const QrScan = ({ handleScan }: QrScanProps) => {
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
            className="w-full max-w-md border rounded px-4 py-2 text-lg"
            placeholder="Scan your QR/Barcode here"
            autoFocus
        />
    );
};

export default QrScan;
