import { Card, CardContent } from "./ui/card";

interface MemberCardProps {
    image: string;
    name: string;
    role?: string;
}

const MemberCard = ({ image, name, role }: MemberCardProps) => {
    return (
        <Card className="group hover:shadow-md transition-shadow">
            <CardContent className="flex flex-col items-center gap-3 p-4 sm:p-6">
                <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full overflow-hidden border-4 border-primary bg-muted">
                    <img
                        src={image}
                        alt={name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                </div>
                <div className="text-center">
                    <p className="font-semibold text-sm sm:text-base text-foreground truncate">
                        {name}
                    </p>
                    {role && (
                        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                            {role}
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default MemberCard;
