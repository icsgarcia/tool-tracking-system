import { useRef } from "react";
import { Card, CardContent } from "./ui/card";
import PrintButton from "./PrintButton";

interface ProfileCardProps {
    user: User;
}

const ProfileCard = ({ user }: ProfileCardProps) => {
    const contentRef = useRef<HTMLDivElement>(null);

    return (
        <Card
            ref={contentRef}
            className="relative max-w-xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden"
        >
            <div className="absolute right-2 top-2 print:hidden">
                <PrintButton contentRef={contentRef} />
            </div>
            <CardContent>
                <div className="flex flex-col items-center gap-4 p-4 sm:gap-6 sm:p-6 md:flex-row md:items-start print:flex-row print:items-start">
                    <div className="flex flex-row items-center gap-4 md:flex-col print:flex-col">
                        <img
                            src="#"
                            alt="user-display-photo"
                            className="w-16 h-16 sm:w-24 sm:h-24 rounded-full border-2 border-gray-300 object-cover shadow"
                        />
                        <img
                            src="#"
                            alt="user-qr-code"
                            className="w-14 h-14 sm:w-20 sm:h-20 border-2 border-dashed border-gray-400 bg-gray-50 rounded-lg object-contain"
                        />
                    </div>

                    <div className="flex flex-col flex-1 gap-3 w-full min-w-0 text-center md:text-left print:text-left">
                        <div>
                            <p className="font-bold text-xl sm:text-2xl text-gray-800 mb-0.5 truncate">
                                {user.lastName}
                            </p>
                            <p className="font-semibold text-base sm:text-lg text-gray-600 mb-0.5 truncate">
                                {user.firstName}{" "}
                                {user.middleName
                                    ? `${user.middleName.charAt(0)}.`
                                    : ""}
                            </p>
                            <p className="italic text-sm text-gray-400 mb-2">
                                {user.schoolNumber}
                            </p>
                            <span className="inline-block bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full font-medium">
                                {user.department} - {user.yearLevel}
                            </span>
                        </div>

                        <div className="flex flex-col gap-1 text-gray-500 text-sm">
                            <p className="min-w-0">
                                <span className="font-medium text-gray-700">
                                    Email:
                                </span>{" "}
                                <span className="break-all">{user.email}</span>
                            </p>
                            <p>
                                <span className="font-medium text-gray-700">
                                    Phone:
                                </span>{" "}
                                {user.number}
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default ProfileCard;
