import { Card, CardContent } from "./ui/card";

const ProfileCard = () => {
    return (
        <Card className="max-w-xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
            <CardContent>
                <div className="flex flex-col md:flex-row items-center gap-6 p-6">
                    {/* Left: Images */}
                    <div className="flex flex-col items-center gap-4">
                        <img
                            src="#"
                            alt="user-display-photo"
                            className="w-24 h-24 rounded-full border-2 border-gray-300 object-cover shadow"
                        />
                        <img
                            src="#"
                            alt="user-qr-code"
                            className="w-20 h-20 border-2 border-dashed border-gray-400 bg-gray-50 rounded-lg object-contain"
                        />
                    </div>
                    {/* Middle: User Info */}
                    <div className="flex-1 text-center md:text-left">
                        <p className="font-bold text-2xl text-gray-800 mb-1">
                            Garcia
                        </p>
                        <p className="font-semibold text-lg text-gray-600 mb-1">
                            Ivan Christopher S.
                        </p>
                        <p className="italic text-sm text-gray-400 mb-2">
                            2019001072
                        </p>
                        <span className="inline-block bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full font-medium mb-2">
                            AMT - 4
                        </span>
                    </div>
                    {/* Right: Contact Info */}
                    <div className="flex flex-col  gap-1 text-gray-500 text-sm">
                        <p>
                            <span className="font-medium text-gray-700">
                                Email:
                            </span>{" "}
                            <br />
                            icsgarcia2002@gmail.com
                        </p>
                        <p>
                            <span className="font-medium text-gray-700">
                                Phone:
                            </span>{" "}
                            <br />
                            09274518883
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default ProfileCard;
