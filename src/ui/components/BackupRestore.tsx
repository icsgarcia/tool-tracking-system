import { useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "./ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { DatabaseBackup, Download, Upload } from "lucide-react";
import { toast } from "sonner";

const BackupRestore = () => {
    const [isLoading, setIsLoading] = useState(false);

    const handleBackup = async () => {
        setIsLoading(true);
        try {
            const result = await window.api.database.backup();
            if (result.success) {
                toast.success("Database backup saved successfully.");
            } else if (result.error !== "Backup cancelled.") {
                toast.error(result.error || "Backup failed.");
            }
        } catch {
            toast.error("An unexpected error occurred during backup.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleRestore = async () => {
        setIsLoading(true);
        try {
            const result = await window.api.database.restore();
            if (result.success) {
                toast.success(
                    "Database restored successfully. You may now log in with your restored data.",
                );
            } else if (result.error !== "Restore cancelled.") {
                toast.error(result.error || "Restore failed.");
            }
        } catch {
            toast.error("An unexpected error occurred during restore.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                        <DatabaseBackup className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <CardTitle className="text-lg sm:text-xl">
                            Backup & Restore
                        </CardTitle>
                        <CardDescription className="text-xs sm:text-sm">
                            Transfer your database between computers
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <Separator className="mx-4 sm:mx-6 w-auto" />
            <CardContent className="pt-4 sm:pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <Card className="border-dashed">
                        <CardHeader>
                            <CardTitle className="text-base sm:text-lg">
                                Backup Database
                            </CardTitle>
                            <CardDescription className="text-xs sm:text-sm">
                                Save a copy of your current database to a file.
                                You can transfer this file to another computer.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button
                                onClick={handleBackup}
                                disabled={isLoading}
                                className="w-full"
                            >
                                <Download className="w-4 h-4 mr-2" />
                                {isLoading ? "Processing..." : "Save Backup"}
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="border-dashed">
                        <CardHeader>
                            <CardTitle className="text-base sm:text-lg">
                                Restore Database
                            </CardTitle>
                            <CardDescription className="text-xs sm:text-sm">
                                Load a previously saved backup file. This will
                                replace all current data.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button
                                onClick={handleRestore}
                                disabled={isLoading}
                                variant="outline"
                                className="w-full"
                            >
                                <Upload className="w-4 h-4 mr-2" />
                                {isLoading
                                    ? "Processing..."
                                    : "Restore from Backup"}
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-muted/50 rounded-lg">
                    <p className="text-xs sm:text-sm text-muted-foreground font-medium mb-2">
                        How to transfer data to another computer:
                    </p>
                    <ol className="text-xs sm:text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                        <li>
                            Click "Save Backup" to export your database to a
                            file.
                        </li>
                        <li>
                            Copy the backup file to the other computer (via USB,
                            cloud storage, etc.).
                        </li>
                        <li>
                            On the other computer, open Tool Keeper and go to
                            this tab.
                        </li>
                        <li>
                            Click "Restore from Backup" and select the backup
                            file. The data will be loaded immediately.
                        </li>
                    </ol>
                </div>
            </CardContent>
        </Card>
    );
};

export default BackupRestore;
