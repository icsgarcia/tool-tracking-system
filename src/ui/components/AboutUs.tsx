import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "./ui/card";
import { Separator } from "@/components/ui/separator";
import MemberCard from "./MemberCard";

const members = [
    { image: "/group-members/Franze_Nua.jpg", name: "Franze Nua" },
    { image: "/group-members/Nicos_Carpio.jpg", name: "Nicos Carpio" },
    { image: "/group-members/Melvin_Diaz.jpg", name: "Melvin Diaz" },
    {
        image: "/group-members/Kimberly_Dioquino.jpg",
        name: "Kimberly Dioquino",
    },
    {
        image: "/group-members/Napoleon_Francisco.jpg",
        name: "Napoleon Francisco",
    },
    {
        image: "/group-members/Benedict_Mangornong.jpg",
        name: "Benedict Mangornong",
    },

    { image: "/group-members/Leigh_Torio.jpg", name: "Leigh Torio" },
];

const AboutUs = () => {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg sm:text-xl">About Us</CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                    Meet the team behind the Asset Tracking System
                </CardDescription>
            </CardHeader>
            <Separator />
            <CardContent className="pt-4 sm:pt-6">
                <div className="flex flex-col items-center gap-5 sm:gap-6 w-full">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 w-full">
                        <div className="md:col-span-2 lg:col-span-3 flex justify-center">
                            <div className="w-full md:max-w-[calc((100%-1.5rem)/2)] lg:max-w-[calc((100%-3rem)/3)]">
                                <MemberCard
                                    image={members[0].image}
                                    name={members[0].name}
                                    role="Leader"
                                />
                            </div>
                        </div>
                        {members.slice(1).map((member) => (
                            <MemberCard
                                key={member.name}
                                image={member.image}
                                name={member.name}
                            />
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default AboutUs;
