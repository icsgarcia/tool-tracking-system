import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "./ui/card";
import { Separator } from "@/components/ui/separator";

const AboutUs = () => {
    return (
        <Card className="max-w-2xl">
            <CardHeader>
                <CardTitle className="text-lg sm:text-xl">About</CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                    Asset Tracking System
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    The Asset Tracking System is a asset management platform
                    designed to track and manage assets, equipment, and other
                    assets within an organization. Users can borrow and return
                    assets using QR code scanning.
                </p>
                <Separator />
                <div className="space-y-2">
                    <h3 className="font-semibold text-sm sm:text-base">
                        Features
                    </h3>
                    <ul className="list-inside list-disc space-y-1 text-xs sm:text-sm text-muted-foreground">
                        <li>
                            QR code-based user login and asset identification
                        </li>
                        <li>Bulk user and asset creation via Excel upload</li>
                        <li>Real-time asset availability tracking</li>
                        <li>Transaction history for borrowing and returns</li>
                        <li>Admin dashboard for system management</li>
                    </ul>
                </div>
                <Separator />
                <div className="text-xs text-muted-foreground/70">
                    Version 1.0.0 &middot; Built with React, Electron, and
                    NestJS
                </div>
            </CardContent>
        </Card>
    );
};

export default AboutUs;
