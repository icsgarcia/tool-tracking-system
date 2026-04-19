import { useState } from "react";
import { Button } from "./ui/button";
import { FileDown, Loader2 } from "lucide-react";

interface ExportExcelProps {
    files: string;
    role?: string;
    userId?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    range?: "today" | "week" | "month";
}

const ExportExcel = ({
    files,
    role,
    userId,
    search,
    sortBy,
    sortOrder,
    range,
}: ExportExcelProps) => {
    const [exporting, setExporting] = useState(false);

    const handleExport = async () => {
        setExporting(true);
        try {
            let result;
            switch (files) {
                case "users":
                    result = await window.api.user.exportUsersWithSpreadsheet({
                        search,
                        sortBy,
                        sortOrder,
                        range,
                    });
                    break;
                case "assets":
                    result = await window.api.asset.exportAssetsWithSpreadsheet(
                        {
                            search,
                            sortBy,
                            sortOrder,
                            range,
                        },
                    );
                    break;
                case "transactions":
                    if (role === "STUDENT" || role === "STAFF") {
                        result =
                            await window.api.transaction.exportUserTransactionWithSpreadsheet(
                                userId!,
                                {
                                    search,
                                    sortBy,
                                    sortOrder,
                                    range,
                                },
                            );
                    } else {
                        result =
                            await window.api.transaction.exportTransactionWithSpreadsheet(
                                {
                                    search,
                                    sortBy,
                                    sortOrder,
                                    range,
                                },
                            );
                    }
                    break;
                default:
                    throw new Error("Invalid file type");
            }

            return result;
        } catch (error) {
            console.error("Export failed:", error);
        } finally {
            setExporting(false);
        }
    };

    return (
        <Button
            variant={"outline"}
            onClick={handleExport}
            disabled={exporting}
            size="sm"
            className="shrink-0 sm:size-default"
        >
            {exporting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
                <FileDown className="h-4 w-4" />
            )}
            <span className="hidden sm:inline">
                {exporting ? "Exporting..." : "Export with Excel"}
            </span>
        </Button>
    );
};

export default ExportExcel;
